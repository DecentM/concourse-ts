export enum ValidationWarningType {
  Fatal,
  NonFatal,
}

export class ValidationWarning {
  public messages: string[]
  public type: ValidationWarningType

  constructor({
    messages,
    type,
  }: {
    messages: string[]
    type: ValidationWarningType
  }) {
    this.messages = messages
    this.type = type
  }
}

export class WarningStore {
  private warnings: ValidationWarning[] = []

  public add_warning = (
    type: ValidationWarningType,
    ...messages: unknown[]
  ) => {
    this.warnings.push(
      new ValidationWarning({
        type,
        messages: messages.map((message) => String(message)),
      })
    )

    return this
  }

  public has_fatal = () => {
    return this.warnings.some(
      (warning) => warning.type === ValidationWarningType.Fatal
    )
  }

  public get_warnings = (type?: ValidationWarningType) => {
    if (!type) {
      return this.warnings
    }

    return this.warnings.filter((warning) => warning.type === type)
  }

  public copy_from = (...warningStores: WarningStore[]) => {
    warningStores.forEach((warnings) => {
      this.warnings.push(...warnings.get_warnings())
    })

    return this
  }
}

export type Location = {
  section: string
  index: number
}

export const to_identifier = (l: Location, name: string): string => {
  return `${l.section}.${name}`
}
