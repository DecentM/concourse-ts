import test from 'ava'
import {ValidationWarningType, WarningStore} from '.'

test('returns empty array with no warnings', (t) => {
  const warnings = new WarningStore()

  t.deepEqual(warnings.get_warnings(), [])
})

test('adds fatal errors and reports them', (t) => {
  const warnings = new WarningStore()

  warnings.add_warning(ValidationWarningType.Fatal, 'aaa')

  t.is(warnings.get_warnings().length, 1)
  t.is(warnings.get_warnings()[0].get_message(), 'aaa')
  t.true(warnings.has_fatal())
})

test('adds non-fatal errors and reports them', (t) => {
  const warnings = new WarningStore()

  warnings.add_warning(ValidationWarningType.NonFatal, 'bbb')

  t.is(warnings.get_warnings().length, 1)
  t.is(warnings.get_warnings()[0].get_message(), 'bbb')
  t.false(warnings.has_fatal())
})

test('distinguishes between fatal and non-fatal errors', (t) => {
  const warnings = new WarningStore()

  warnings.add_warning(ValidationWarningType.Fatal, 'aaa')
  warnings.add_warning(ValidationWarningType.NonFatal, 'bbb')

  t.is(warnings.get_warnings().length, 2)
  t.is(warnings.get_warnings()[0].get_message(), 'aaa')
  t.is(warnings.get_warnings()[1].get_message(), 'bbb')
  t.true(warnings.has_fatal())
})

test('copies all warnings', (t) => {
  const warnings1 = new WarningStore()
  const warnings2 = new WarningStore()

  warnings1.add_warning(ValidationWarningType.NonFatal, 'bbb')

  warnings2.copy_from(warnings1)
  warnings2.add_warning(ValidationWarningType.Fatal, 'aaa')

  t.is(warnings1.get_warnings().length, 1)
  t.is(warnings1.get_warnings()[0].get_message(), 'bbb')
  t.false(warnings1.has_fatal())

  t.is(warnings2.get_warnings().length, 2)
  t.is(warnings2.get_warnings()[0].get_message(), 'bbb')
  t.is(warnings2.get_warnings()[1].get_message(), 'aaa')
  t.true(warnings2.has_fatal())
})
