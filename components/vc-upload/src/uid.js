const now = +(new Date())
let index = 0

export default function uid () {
  return `rc-upload-${now}-${++index}`
}
