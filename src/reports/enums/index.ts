export enum EReportStatus {
    UPLOADED = 'загружен',
    READY = 'готов'
}

export enum EMatch {
    OK = 'match',
    PRETTY_CLOSE = 'pretty match',
    WARNING = 'warning',
    BAD = 'not a match'
}

export enum EAppointmentsTypes {
    LS = 'ЛИ',
    IS = 'ИИ',
    CONSULTING = 'Консультация'
}

export enum EMandatory {
    REQUIRED = 'да',
    BY_APPOINTMENT = 'по назначению',
    NO_CONTRA = 'при отсутствии противопоказаний'
}