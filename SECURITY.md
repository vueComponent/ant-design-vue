Version
3.2.20

Reproduction link<br>
https://codesandbox.io/s/tuo-dong-shi-li-ant-design-vue-3-2-20-forked-qj65wh 
<br>
如果你发现codesandbox打开后无法运行, 那么你可以尝试访问 https://3x.antdv.com/components/tree-cn 
<br>
在该官方文档中的 tree 组件 "拖动示例" 中也是存在相同问题
<br>
<br>
Steps to reproduce <br>
1.展开0-0节点;<br>
2.选中0-0-1节点;<br>
3.将0-0-1节点“向下拖拽”至 0-1 节点同级;<br>
4.拖拽后不起效，0-0-1节点还是在 0-0 节点中;<br>

图片实例链接：https://lxy-1304560110.cos.ap-nanjing.myqcloud.com/WechatIMG3196.png?q-sign-algorithm=sha1&q-ak=AKID2TA75V0lSjVOaZIu5Iod6jmgxR3HEjCXkrhkz-HJz5khz1kibtck79TNuXK3x1Af&q-sign-time=1689839065;1689842665&q-key-time=1689839065;1689842665&q-header-list=host&q-url-param-list=ci-process&q-signature=e5578b515d148353d790ce35b9beba2499e24158&x-cos-security-token=nlmSPA2WZGLDhFBghBDPYMLzsKmrQCba86da1319d9738902a10f4b09eb1cd2468vfvEsS1NLN5TV5yXo-9iWl22UeN-z3cwwn7s1iW5vIgPJb_KysDLahOlNTc8KvVm7iiikY7Mv2pAhJYPDRpAH200kvB2hKI2nQfWOlAnh7Np8wZiSHAzOPtsDIl2eHZU3cFyihdVKoneIQMxaWAWcMecHAbR2Rccm2J4kjTKjPyrVBAnnLVINCGPCxmjvf1&ci-process=originImage

<img src="https://lxy-1304560110.cos.ap-nanjing.myqcloud.com/WechatIMG3196.png?q-sign-algorithm=sha1&q-ak=AKID2TA75V0lSjVOaZIu5Iod6jmgxR3HEjCXkrhkz-HJz5khz1kibtck79TNuXK3x1Af&q-sign-time=1689839065;1689842665&q-key-time=1689839065;1689842665&q-header-list=host&q-url-param-list=ci-process&q-signature=e5578b515d148353d790ce35b9beba2499e24158&x-cos-security-token=nlmSPA2WZGLDhFBghBDPYMLzsKmrQCba86da1319d9738902a10f4b09eb1cd2468vfvEsS1NLN5TV5yXo-9iWl22UeN-z3cwwn7s1iW5vIgPJb_KysDLahOlNTc8KvVm7iiikY7Mv2pAhJYPDRpAH200kvB2hKI2nQfWOlAnh7Np8wZiSHAzOPtsDIl2eHZU3cFyihdVKoneIQMxaWAWcMecHAbR2Rccm2J4kjTKjPyrVBAnnLVINCGPCxmjvf1&ci-process=originImage" />

What is expected?
我希望可以做到可以将 0-0 节点的子节点 0-0-1, 向下拖拽可以拖拽到与 0-1 和 0-2 同级的位置

What is actually happening?
我看了 drop 事件的结果，我将 0-0-1 “向下拖拽”至 0-2 节点同级的位置，发现目标节点的数据，居然还是 0-1;
然后我尝试了 ant design React 4.x 版本发现这个问题是不存在的
