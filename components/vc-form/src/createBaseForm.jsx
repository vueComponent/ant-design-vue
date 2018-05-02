import createReactClass from 'create-react-class'
import AsyncValidator from 'async-validator'
import warning from 'warning'
import get from 'lodash/get'
import set from 'lodash/set'
import createFieldsStore from './createFieldsStore'
import { cloneElement } from '../../_util/vnode'
import {
  argumentContainer,
  identity,
  normalizeValidateRules,
  getValidateTriggers,
  getValueFromEvent,
  hasRules,
  getParams,
  isEmptyObject,
  flattenArray,
} from './utils'

const DEFAULT_TRIGGER = 'onChange'

function createBaseForm (option = {}, mixins = []) {
  const {
    validateMessages,
    onFieldsChange,
    onValuesChange,
    mapProps = identity,
    mapPropsToFields,
    fieldNameProp,
    fieldMetaProp,
    fieldDataProp,
    formPropName = 'form',
    // @deprecated
    withRef,
  } = option

  return function decorate (WrappedComponent) {
    const Form = createReactClass({
      mixins,

      getInitialState () {
        const fields = mapPropsToFields && mapPropsToFields(this.props)
        this.fieldsStore = createFieldsStore(fields || {})

        this.instances = {}
        this.cachedBind = {}
        this.clearedFieldMetaCache = {};
        // HACK: https://github.com/ant-design/ant-design/issues/6406
        ['getFieldsValue',
          'getFieldValue',
          'setFieldsInitialValue',
          'getFieldsError',
          'getFieldError',
          'isFieldValidating',
          'isFieldsValidating',
          'isFieldsTouched',
          'isFieldTouched'].forEach(key => {
          this[key] = (...args) => {
            if (process.env.NODE_ENV !== 'production') {
              warning(
                false,
                'you should not use `ref` on enhanced form, please use `wrappedComponentRef`. ' +
                 'See: https://github.com/react-component/form#note-use-wrappedcomponentref-instead-of-withref-after-rc-form140'
              )
            }
            return this.fieldsStore[key](...args)
          }
        })

        return {
          submitting: false,
        }
      },

      componentWillReceiveProps (nextProps) {
        if (mapPropsToFields) {
          this.fieldsStore.updateFields(mapPropsToFields(nextProps))
        }
      },

      onCollectCommon (name, action, args) {
        const fieldMeta = this.fieldsStore.getFieldMeta(name)
        if (fieldMeta[action]) {
          fieldMeta[action](...args)
        } else if (fieldMeta.originalProps && fieldMeta.originalProps[action]) {
          fieldMeta.originalProps[action](...args)
        }
        const value = fieldMeta.getValueFromEvent
          ? fieldMeta.getValueFromEvent(...args)
          : getValueFromEvent(...args)
        if (onValuesChange && value !== this.fieldsStore.getFieldValue(name)) {
          const valuesAll = this.fieldsStore.getAllValues()
          const valuesAllSet = {}
          valuesAll[name] = value
          Object.keys(valuesAll).forEach(key => set(valuesAllSet, key, valuesAll[key]))
          onValuesChange(this.props, set({}, name, value), valuesAllSet)
        }
        const field = this.fieldsStore.getField(name)
        return ({ name, field: { ...field, value, touched: true }, fieldMeta })
      },

      onCollect (name_, action, ...args) {
        const { name, field, fieldMeta } = this.onCollectCommon(name_, action, args)
        const { validate } = fieldMeta
        const newField = {
          ...field,
          dirty: hasRules(validate),
        }
        this.setFields({
          [name]: newField,
        })
      },

      onCollectValidate (name_, action, ...args) {
        const { field, fieldMeta } = this.onCollectCommon(name_, action, args)
        const newField = {
          ...field,
          dirty: true,
        }
        this.validateFieldsInternal([newField], {
          action,
          options: {
            firstFields: !!fieldMeta.validateFirst,
          },
        })
      },

      getCacheBind (name, action, fn) {
        if (!this.cachedBind[name]) {
          this.cachedBind[name] = {}
        }
        const cache = this.cachedBind[name]
        if (!cache[action]) {
          cache[action] = fn.bind(this, name, action)
        }
        return cache[action]
      },

      recoverClearedField (name) {
        if (this.clearedFieldMetaCache[name]) {
          this.fieldsStore.setFields({
            [name]: this.clearedFieldMetaCache[name].field,
          })
          this.fieldsStore.setFieldMeta(name, this.clearedFieldMetaCache[name].meta)
          delete this.clearedFieldMetaCache[name]
        }
      },

      getFieldDecorator (name, fieldOption) {
        const props = this.getFieldProps(name, fieldOption)
        return (fieldElem) => {
          const fieldMeta = this.fieldsStore.getFieldMeta(name)
          const originalProps = fieldElem.props
          if (process.env.NODE_ENV !== 'production') {
            const valuePropName = fieldMeta.valuePropName
            warning(
              !(valuePropName in originalProps),
              `\`getFieldDecorator\` will override \`${valuePropName}\`, ` +
              `so please don't set \`${valuePropName}\` directly ` +
              `and use \`setFieldsValue\` to set it.`
            )
            const defaultValuePropName =
              `default${valuePropName[0].toUpperCase()}${valuePropName.slice(1)}`
            warning(
              !(defaultValuePropName in originalProps),
              `\`${defaultValuePropName}\` is invalid ` +
              `for \`getFieldDecorator\` will set \`${valuePropName}\`,` +
              ` please use \`option.initialValue\` instead.`
            )
          }
          fieldMeta.originalProps = originalProps
          fieldMeta.ref = fieldElem.ref
          return cloneElement(fieldElem, {
            ...props,
            ...this.fieldsStore.getFieldValuePropValue(fieldMeta),
          })
        }
      },

      getFieldProps (name, usersFieldOption = {}) {
        if (!name) {
          throw new Error('Must call `getFieldProps` with valid name string!')
        }
        if (process.env.NODE_ENV !== 'production') {
          warning(
            this.fieldsStore.isValidNestedFieldName(name),
            'One field name cannot be part of another, e.g. `a` and `a.b`.'
          )
          warning(
            !('exclusive' in usersFieldOption),
            '`option.exclusive` of `getFieldProps`|`getFieldDecorator` had been remove.'
          )
        }

        delete this.clearedFieldMetaCache[name]

        const fieldOption = {
          name,
          trigger: DEFAULT_TRIGGER,
          valuePropName: 'value',
          validate: [],
          ...usersFieldOption,
        }

        const {
          rules,
          trigger,
          validateTrigger = trigger,
          validate,
        } = fieldOption

        const fieldMeta = this.fieldsStore.getFieldMeta(name)
        if ('initialValue' in fieldOption) {
          fieldMeta.initialValue = fieldOption.initialValue
        }

        const inputProps = {
          ...this.fieldsStore.getFieldValuePropValue(fieldOption),
          ref: this.getCacheBind(name, `${name}__ref`, this.saveRef),
        }
        if (fieldNameProp) {
          inputProps[fieldNameProp] = name
        }

        const validateRules = normalizeValidateRules(validate, rules, validateTrigger)
        const validateTriggers = getValidateTriggers(validateRules)
        validateTriggers.forEach((action) => {
          if (inputProps[action]) return
          inputProps[action] = this.getCacheBind(name, action, this.onCollectValidate)
        })

        // make sure that the value will be collect
        if (trigger && validateTriggers.indexOf(trigger) === -1) {
          inputProps[trigger] = this.getCacheBind(name, trigger, this.onCollect)
        }

        const meta = {
          ...fieldMeta,
          ...fieldOption,
          validate: validateRules,
        }
        this.fieldsStore.setFieldMeta(name, meta)
        if (fieldMetaProp) {
          inputProps[fieldMetaProp] = meta
        }

        if (fieldDataProp) {
          inputProps[fieldDataProp] = this.fieldsStore.getField(name)
        }

        return inputProps
      },

      getFieldInstance (name) {
        return this.instances[name]
      },

      getRules (fieldMeta, action) {
        const actionRules = fieldMeta.validate.filter((item) => {
          return !action || item.trigger.indexOf(action) >= 0
        }).map((item) => item.rules)
        return flattenArray(actionRules)
      },

      setFields (maybeNestedFields, callback) {
        const fields = this.fieldsStore.flattenRegisteredFields(maybeNestedFields)
        this.fieldsStore.setFields(fields)
        if (onFieldsChange) {
          const changedFields = Object.keys(fields)
            .reduce((acc, name) => set(acc, name, this.fieldsStore.getField(name)), {})
          onFieldsChange(this.props, changedFields, this.fieldsStore.getNestedAllFields())
        }
        this.forceUpdate(callback)
      },

      resetFields (ns) {
        const newFields = this.fieldsStore.resetFields(ns)
        if (Object.keys(newFields).length > 0) {
          this.setFields(newFields)
        }
        if (ns) {
          const names = Array.isArray(ns) ? ns : [ns]
          names.forEach(name => delete this.clearedFieldMetaCache[name])
        } else {
          this.clearedFieldMetaCache = {}
        }
      },

      setFieldsValue (changedValues, callback) {
        const { fieldsMeta } = this.fieldsStore
        const values = this.fieldsStore.flattenRegisteredFields(changedValues)
        const newFields = Object.keys(values).reduce((acc, name) => {
          const isRegistered = fieldsMeta[name]
          if (process.env.NODE_ENV !== 'production') {
            warning(
              isRegistered,
              'Cannot use `setFieldsValue` until ' +
                'you use `getFieldDecorator` or `getFieldProps` to register it.'
            )
          }
          if (isRegistered) {
            const value = values[name]
            acc[name] = {
              value,
            }
          }
          return acc
        }, {})
        this.setFields(newFields, callback)
        if (onValuesChange) {
          const allValues = this.fieldsStore.getAllValues()
          onValuesChange(this.props, changedValues, allValues)
        }
      },

      saveRef (name, _, component) {
        if (!component) {
          // after destroy, delete data
          this.clearedFieldMetaCache[name] = {
            field: this.fieldsStore.getField(name),
            meta: this.fieldsStore.getFieldMeta(name),
          }
          this.fieldsStore.clearField(name)
          delete this.instances[name]
          delete this.cachedBind[name]
          return
        }
        this.recoverClearedField(name)
        const fieldMeta = this.fieldsStore.getFieldMeta(name)
        if (fieldMeta) {
          const ref = fieldMeta.ref
          if (ref) {
            if (typeof ref === 'string') {
              throw new Error(`can not set ref string for ${name}`)
            }
            ref(component)
          }
        }
        this.instances[name] = component
      },

      validateFieldsInternal (fields, {
        fieldNames,
        action,
        options = {},
      }, callback) {
        const allRules = {}
        const allValues = {}
        const allFields = {}
        const alreadyErrors = {}
        fields.forEach((field) => {
          const name = field.name
          if (options.force !== true && field.dirty === false) {
            if (field.errors) {
              set(alreadyErrors, name, { errors: field.errors })
            }
            return
          }
          const fieldMeta = this.fieldsStore.getFieldMeta(name)
          const newField = {
            ...field,
          }
          newField.errors = undefined
          newField.validating = true
          newField.dirty = true
          allRules[name] = this.getRules(fieldMeta, action)
          allValues[name] = newField.value
          allFields[name] = newField
        })
        this.setFields(allFields)
        // in case normalize
        Object.keys(allValues).forEach((f) => {
          allValues[f] = this.fieldsStore.getFieldValue(f)
        })
        if (callback && isEmptyObject(allFields)) {
          callback(isEmptyObject(alreadyErrors) ? null : alreadyErrors,
            this.fieldsStore.getFieldsValue(fieldNames))
          return
        }
        const validator = new AsyncValidator(allRules)
        if (validateMessages) {
          validator.messages(validateMessages)
        }
        validator.validate(allValues, options, (errors) => {
          const errorsGroup = {
            ...alreadyErrors,
          }
          if (errors && errors.length) {
            errors.forEach((e) => {
              const fieldName = e.field
              const field = get(errorsGroup, fieldName)
              if (typeof field !== 'object' || Array.isArray(field)) {
                set(errorsGroup, fieldName, { errors: [] })
              }
              const fieldErrors = get(errorsGroup, fieldName.concat('.errors'))
              fieldErrors.push(e)
            })
          }
          const expired = []
          const nowAllFields = {}
          Object.keys(allRules).forEach((name) => {
            const fieldErrors = get(errorsGroup, name)
            const nowField = this.fieldsStore.getField(name)
            // avoid concurrency problems
            if (nowField.value !== allValues[name]) {
              expired.push({
                name,
              })
            } else {
              nowField.errors = fieldErrors && fieldErrors.errors
              nowField.value = allValues[name]
              nowField.validating = false
              nowField.dirty = false
              nowAllFields[name] = nowField
            }
          })
          this.setFields(nowAllFields)
          if (callback) {
            if (expired.length) {
              expired.forEach(({ name }) => {
                const fieldErrors = [{
                  message: `${name} need to revalidate`,
                  field: name,
                }]
                set(errorsGroup, name, {
                  expired: true,
                  errors: fieldErrors,
                })
              })
            }

            callback(isEmptyObject(errorsGroup) ? null : errorsGroup,
              this.fieldsStore.getFieldsValue(fieldNames))
          }
        })
      },

      validateFields (ns, opt, cb) {
        const { names, callback, options } = getParams(ns, opt, cb)
        const fieldNames = names
          ? this.fieldsStore.getValidFieldsFullName(names)
          : this.fieldsStore.getValidFieldsName()
        const fields = fieldNames
          .filter(name => {
            const fieldMeta = this.fieldsStore.getFieldMeta(name)
            return hasRules(fieldMeta.validate)
          }).map((name) => {
            const field = this.fieldsStore.getField(name)
            field.value = this.fieldsStore.getFieldValue(name)
            return field
          })
        if (!fields.length) {
          if (callback) {
            callback(null, this.fieldsStore.getFieldsValue(fieldNames))
          }
          return
        }
        if (!('firstFields' in options)) {
          options.firstFields = fieldNames.filter((name) => {
            const fieldMeta = this.fieldsStore.getFieldMeta(name)
            return !!fieldMeta.validateFirst
          })
        }
        this.validateFieldsInternal(fields, {
          fieldNames,
          options,
        }, callback)
      },

      isSubmitting () {
        if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
          warning(
            false,
            '`isSubmitting` is deprecated. ' +
              'Actually, it\'s more convenient to handle submitting status by yourself.'
          )
        }
        return this.state.submitting
      },

      submit (callback) {
        if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
          warning(
            false,
            '`submit` is deprecated.' +
              'Actually, it\'s more convenient to handle submitting status by yourself.'
          )
        }
        const fn = () => {
          this.setState({
            submitting: false,
          })
        }
        this.setState({
          submitting: true,
        })
        callback(fn)
      },

      render () {
        const { wrappedComponentRef, ...restProps } = this.props
        const formProps = {
          [formPropName]: this.getForm(),
        }
        if (withRef) {
          if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
            warning(
              false,
              '`withRef` is deprecated, please use `wrappedComponentRef` instead. ' +
                'See: https://github.com/react-component/form#note-use-wrappedcomponentref-instead-of-withref-after-rc-form140'
            )
          }
          formProps.ref = 'wrappedComponent'
        } else if (wrappedComponentRef) {
          formProps.ref = wrappedComponentRef
        }
        const props = mapProps.call(this, {
          ...formProps,
          ...restProps,
        })
        return <WrappedComponent {...props}/>
      },
    })

    return argumentContainer(Form, WrappedComponent)
  }
}

export default createBaseForm
