import * as zodModule from 'zod-actual'

type ZodNamespace = (typeof zodModule)['z']

const moduleWithNamespace = zodModule as {
  z?: ZodNamespace
  default?: ZodNamespace
}

const baseZ = moduleWithNamespace.z ?? moduleWithNamespace.default

if (!baseZ) {
  throw new Error('Zod namespace is unavailable')
}

const originalString = baseZ.string.bind(baseZ)

const stringWithRequired: ZodNamespace['string'] = (params?: unknown) => {
  if (params && typeof params === 'object' && 'required_error' in (params as Record<string, unknown>)) {
    const { required_error, ...rest } = params as Record<string, unknown>
    const normalized: Record<string, unknown> = { ...rest }
    if (required_error !== undefined && normalized.error === undefined) {
      normalized.error = required_error
    }
    return originalString(normalized)
  }

  return originalString(params as never)
}

const compatZ = Object.assign(
  Object.create(Object.getPrototypeOf(baseZ) ?? Object.prototype),
  baseZ,
  { string: stringWithRequired },
) as ZodNamespace

export * from 'zod-actual'
export { compatZ as z }
export default compatZ
