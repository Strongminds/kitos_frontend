export const dataProcessingFields = {
  IsOversightCompleted: 'DataProcessingRegistration.IsOversightCompleted',
  oversightDates: {
    oversightDate: 'DataProcessingRegistrationOversightDate.OversightDate',
    oversightRemark: 'DataProcessingRegistrationOversightDate.OversightRemark',
    oversightReportLink: {
      name: 'DataProcessingRegistrationOversightDate.OversightReportLinkName',
      url: 'DataProcessingRegistrationOversightDate.OversightReportLink',
    },
  },
};

export const itSystemUsageFields = {
  containsAITechnology: 'ITSystemUsage.ContainsAITechnology',
  gdpr: {
    criticality: 'ItSystemUsage.GdprCriticality',
    riskAssessment: 'ItSystemUsage.preriskAssessment',
  },
};
