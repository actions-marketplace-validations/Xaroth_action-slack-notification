import { jest } from '@jest/globals'

// @actions/core is ESM only, so it has to be mocked before the module under test is imported.
const core = {
  getInput: jest.fn(() => ''),
  setOutput: jest.fn(),
  setSecret: jest.fn(),
  exportVariable: jest.fn(),
}
jest.unstable_mockModule('@actions/core', () => core)

const { default: stateHelper, EXPORT_VAR_PREFIX } = await import('utils/state-helper')

describe('state tests', () => {
  const name = 'TESTVALUE'
  const value = 'test'

  beforeAll(() => {
    process.env = {}
  })

  it('stateHelper picks up on process.env variables', () => {
    const [unset] = stateHelper(name)

    // This env variable was never set, so we should expect it to be undefined
    expect(unset).toBeUndefined()
    process.env[`${EXPORT_VAR_PREFIX}${name}`] = value

    // While we may have set it now, stateHelper has already done its thing
    // so this variable should still be undefined
    expect(unset).toBeUndefined()

    process.env[`${EXPORT_VAR_PREFIX}${name}`] = value
    const [withValue] = stateHelper(name)
    // Now that we called it after setting the env var, it should pick up on the value.
    expect(withValue).toEqual(value)
  })

  it('calls exportVariable when setting states', () => {
    const [, setValue] = stateHelper(name)
    setValue(value)
    expect(core.exportVariable).toHaveBeenCalled()
  })

  it('calls setOutput when setting states with output', () => {
    const [, setValue] = stateHelper(name, { output: true })
    setValue(value)
    expect(core.setOutput).toHaveBeenCalled()
  })

  it('marks secrets as secret', () => {
    const [, setValue] = stateHelper(name, { isSensitive: true })
    setValue(value)
    expect(core.setSecret).toHaveBeenCalled()
  })

  it('returns the default when one is specified', () => {
    delete process.env[`${EXPORT_VAR_PREFIX}${name}`]
    const defaultValue = 'this is a test'
    const [value] = stateHelper(name, { defaultValue })

    expect(value).toEqual(defaultValue)
  })

  it('ignores "null" values', () => {
    process.env[`${EXPORT_VAR_PREFIX}${name}`] = 'null'
    const [jsonValue] = stateHelper(name, {
      toValue: (val: string) => JSON.parse(val),
      fromValue: (val: Record<string, string>) => JSON.stringify(val),
      defaultValue: {},
    })
    expect(jsonValue).toEqual({})
  })

  afterEach(() => {
    jest.clearAllMocks()
    delete process.env[`${EXPORT_VAR_PREFIX}${name}`]
  })
})
