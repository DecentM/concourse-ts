import test from 'ava'
import {to_identifier, ValidationWarningType, WarningStore} from '.'

test('returns empty array with no warnings', (t) => {
  const warnings = new WarningStore()

  t.deepEqual(warnings.get_warnings(), [])
})

test('adds fatal errors and reports them', (t) => {
  const warnings = new WarningStore()

  warnings.add_warning(ValidationWarningType.Fatal, 'aaa')

  t.is(warnings.get_warnings().length, 1)
  t.is(warnings.get_warnings()[0].messages.join(', '), 'aaa')
  t.true(warnings.has_fatal())
})

test('adds non-fatal errors and reports them', (t) => {
  const warnings = new WarningStore()

  warnings.add_warning(ValidationWarningType.NonFatal, 'bbb')

  t.is(warnings.get_warnings().length, 1)
  t.is(warnings.get_warnings()[0].messages.join(', '), 'bbb')
  t.false(warnings.has_fatal())
})

test('distinguishes between fatal and non-fatal errors', (t) => {
  const warnings = new WarningStore()

  warnings.add_warning(ValidationWarningType.Fatal, 'aaa')
  warnings.add_warning(ValidationWarningType.NonFatal, 'bbb')

  t.is(warnings.get_warnings().length, 2)
  t.is(warnings.get_warnings()[0].messages.join(', '), 'aaa')
  t.is(warnings.get_warnings()[1].messages.join(', '), 'bbb')
  t.true(warnings.has_fatal())
})

test('returns only requested types', (t) => {
  const warnings = new WarningStore()

  warnings.add_warning(ValidationWarningType.Fatal, 'aaa')
  warnings.add_warning(ValidationWarningType.NonFatal, 'bbb')

  t.is(warnings.get_warnings(ValidationWarningType.Fatal).length, 1)
  t.is(warnings.get_warnings(ValidationWarningType.NonFatal).length, 1)
})

test('copies all warnings', (t) => {
  const warnings1 = new WarningStore()
  const warnings2 = new WarningStore()

  warnings1.add_warning(ValidationWarningType.NonFatal, 'bbb')

  warnings2.copy_from(warnings1)
  warnings2.add_warning(ValidationWarningType.Fatal, 'aaa')

  t.is(warnings1.get_warnings().length, 1)
  t.is(warnings1.get_warnings()[0].messages.join(', '), 'bbb')
  t.false(warnings1.has_fatal())

  t.is(warnings2.get_warnings().length, 2)
  t.is(warnings2.get_warnings()[0].messages.join(', '), 'bbb')
  t.is(warnings2.get_warnings()[1].messages.join(', '), 'aaa')
  t.true(warnings2.has_fatal())
})

test('converts location and name to identifier', (t) => {
  t.is(to_identifier({index: 0, section: 'a'}, 'b'), 'a.b')
})
