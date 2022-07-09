const RFC4122_TEMPLATE = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'

function replacePlaceholders(placeholder) {
  let value = (Math.random() * 16) | 0
  value = placeholder === 'x' ? value : (value & 0x3) | 0x8
  return value.toString(16)
}

export const uuid = () => {
  return RFC4122_TEMPLATE.replace(/[xy]/g, replacePlaceholders)
}
