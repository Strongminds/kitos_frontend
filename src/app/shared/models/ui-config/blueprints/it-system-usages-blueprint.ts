import { UIModuleConfigKey } from '../../../enums/ui-module-config-key';
import { uiConfigHelpTexts } from '../ui-config-helptexts';

export const ItSystemUsageUiBluePrint = {
  module: UIModuleConfigKey.ItSystemUsage,
  isObligatory: false,
  helpText: uiConfigHelpTexts.generalUiCustomizationHelpText,
  text: $localize`IT-Systemer i anvendelse`,
  children: {
    frontPage: {
      text: $localize`Systemforside`,
      isObligatory: true,
      helpText: uiConfigHelpTexts.cannotChangeTabOnlyThroughModuleConfig,
      children: {
        name: {
          text: $localize`Navn`,
          isObligatory: true,
        },
        systemId: {
          text: $localize`System ID`,
        },
        version: {
          text: $localize`Version`,
        },
        amountOfUsers: {
          text: $localize`Antal brugere`,
        },
        dataClassification: {
          text: $localize`Klassifikation af data`,
        },
        description: {
          text: $localize`Beskrivelse`,
        },
        takenIntoUsageBy: {
          text: $localize`Taget i anvendelse af`,
        },
        lastEditedBy: {
          text: $localize`Sidst redigeret (bruger)`,
        },
        lastEditedAt: {
          text: $localize`Sidst redigeret (dato)`,
        },
        lifeCycleStatus: {
          text: $localize`Livscyklus`,
        },
        usagePeriod: {
          text: $localize`Datofelter`,
          helpText: $localize`Dækker felterne “Ibrugtagningsdato” og “Slutdato for anvendelse”`,
        },
        status: {
          text: $localize`Status`,
        },
      },
    },
    contracts: {
      text: $localize`Kontrakter`,
      helpText: uiConfigHelpTexts.cannotChangeTabOnlyThroughModuleConfig,
      children: {
        associatedContracts: {
          text: $localize`Tilknyttede kontrakter`,
        },
        selectContractToDetermineIfItSystemIsActive: {
          text: $localize`Hvilken kontrakt skal afgøre om IT systemet er aktivt`,
        },
      },
    },
    dataProcessing: {
      text: $localize`Databehandling`,
      helpText: $localize`Det er kun muligt at fjerne dette faneblad ved at slå det relaterede modul fra`,
    },
    gdpr: {
      text: $localize`GDPR`,
      children: {
        purpose: {
          text: $localize`Systemets overordnede formål`,
        },
        businessCritical: {
          text: $localize`Forretningskritisk IT-System`,
        },
        hostedAt: {
          text: $localize`IT-Systemet driftes`,
        },
        documentation: {
          text: $localize`Link til fortegnelse`,
        },
        noPersonalData: {
          text: $localize`Ingen personoplysninger`,
        },
        normalPersonalData: {
          text: $localize`Almindelige personoplysninger`,
        },
        sensitivePersonalData: {
          text: $localize`Følsomme personoplysninger`,
        },
        legalData: {
          text: $localize`Straffedomme og lovovertrædelser`,
        },
        registeredCategories: {
          text: $localize`Hvilke kategorier af registrerede indgår i databehandlingen?`,
        },
        technicalPrecautions: {
          text: $localize`Implementeret passende tekniske foranstaltninger`,
        },
        userSupervision: {
          text: $localize`Logning af brugerkontrol`,
        },
        plannedRiskAssessmentDate: {
          text: $localize`Dato for planlagt risikovurdering`,
        },
      },
    },
    systemRoles: {
      text: $localize`Systemroller`,
    },
    organization: {
      text: $localize`Organisation`,
    },
    systemRelations: {
      text: $localize`Relationer`,
    },
    interfaces: {
      text: $localize`Udstillede snitflader`,
    },
    archiving: {
      text: $localize`Arkivering`,
    },
    hierarchy: {
      text: $localize`Hierarki`,
    },
    localKle: {
      text: $localize`Lokale KLE`,
    },
    advice: {
      text: $localize`Advis`,
    },
    localReferences: {
      text: $localize`Lokale referencer`,
    },
  },
};
