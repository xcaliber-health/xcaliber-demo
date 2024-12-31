export const policyData = [
    {
        policyName: 'Name(s)',
        policyDescription: [
            'Randomization: anon.fake_first_name() and anon.fake_last_name()',
            'Pseudonymization (Deterministic Token)  :  anon.pseudo_first_name(seed,salt) and anon.pseudo_last_name(seed,salt)'
        ],
        defaultDescription: 'Pseudonymization (Deterministic Token)  :  anon.pseudo_first_name(seed,salt) and anon.pseudo_last_name(seed,salt)'
    },
    {
        policyName: 'Email(s)',
        policyDescription: [
            'Randomization: anon.fake_email()',
            'Pseudonymization (Deterministic Token)  :  anon.pseudo_email(seed,salt)',
            'Masking: anon.partial_email("daamien@gmail.com") -> da**@gm****.com'
        ],
        defaultDescription: 'Masking: anon.partial_email("daamien@gmail.com") -> da**@gm****.com'
    },
    {
        policyName: 'Address(es)',
        policyDescription: [
            'Pseudonymization (Deterministic Token)  :  anon.pseudo_city(seed,salt)',
            'Randomization: anon.fake_city() https://faker.readthedocs.io/en/master/locales/en_US.html'
        ],
        defaultDescription: 'Randomization: anon.fake_city() https://faker.readthedocs.io/en/master/locales/en_US.html'
    },
    {
        policyName: 'Phone Number(s)',
        policyDescription: [
            'Masking: anon.partial(\'(868)767985\',5,\'XXX\',3) -> \'(868)XXX985\'',
            'Randomization: anon.random_phone(p)'
        ],
        defaultDescription: 'Randomization: anon.random_phone(p)'
    },
    {
        policyName: 'Dates and Times',
        policyDescription: [
            'Generalisation: 1979-12-29 will get converted to range ["1970-01-01","1980-01-01")',
            "Noise: anon.dnoise(birth_datetime, '30 days') -> Random date between -30 to +30 days",
            'Partial Scrambling : anon.partial(\'1979-12-29\',4,\'-xx-xx\',0) will return \'1979-XX-XX\';'
        ],
        defaultDescription: 'Partial Scrambling : anon.partial(\'1979-12-29\',4,\'-xx-xx\',0) will return \'1979-XX-XX\';'
    },
    {
        policyName: 'Race',
        policyDescription: [
            'Random in ENUM : anon.random_in_enum(variable_of_an_enum_type) returns any val'
        ],
        defaultDescription: 'Random in ENUM : anon.random_in_enum(variable_of_an_enum_type) returns any val'
    },
    {
        policyName: 'Ethnicity',
        policyDescription: [
            'Random in ENUM : anon.random_in_enum(variable_of_an_enum_type) returns any val'
        ],
        defaultDescription: 'Random in ENUM : anon.random_in_enum(variable_of_an_enum_type) returns any val'
    },
    {
        policyName: 'Sex',
        policyDescription: [
            'Random in ENUM : anon.random_in_enum(variable_of_an_enum_type) returns any val'
        ],
        defaultDescription: 'Random in ENUM : anon.random_in_enum(variable_of_an_enum_type) returns any val'
    },
    {
        policyName: 'Gender',
        policyDescription: [
            'Random in ENUM : anon.random_in_enum(variable_of_an_enum_type) returns any val'
        ],
        defaultDescription: 'Random in ENUM : anon.random_in_enum(variable_of_an_enum_type) returns any val'
    },
    {
        policyName: 'Credit Card Number(s)',
        policyDescription: [
            'Destructions: Replace column with Static string like ‘CONFIDENTIAL’',
            'Encryption:  Enabling encryption on the column using pgsodium',
            'Faking: https://faker.readthedocs.io/en/master/locales/en_US.html#faker-providers-credit-card',
            'Masking: anon.partial(\'3245868876798885\',6,\'XXXXXXXX\',2) -> \'3245XXXXXXXX85\''
        ],
        defaultDescription: 'Destructions: Replace column with Static string like ‘CONFIDENTIAL’'
    },
    {
        policyName: 'Insurance Group ID',
        policyDescription: [
            'Destructions: Replace column with Static string like ‘CONFIDENTIAL’',
            'Encryption:  Enabling encryption on the column using pgsodium',
            'Masking: anon.partial(\'3095923\',4,\'XXXX\',0) -> \'309XXXX\''
        ],
        defaultDescription: 'Destructions: Replace column with Static string like ‘CONFIDENTIAL’'
    },
    {
        policyName: 'Insurance Member ID',
        policyDescription: [
            'Destructions: Replace column with Static string like ‘CONFIDENTIAL’',
            'Encryption:  Enabling encryption on the column using pgsodium',
            'Masking: anon.partial(\'MVP402938716\',6,\'XXXXXX\',0) -> \'MVP402XXXXXX\''
        ],
        defaultDescription: 'Destructions: Replace column with Static string like ‘CONFIDENTIAL’'
    },
    {
        policyName: 'Social Security Number',
        policyDescription: [
            'Destructions: Replace column with Static string like ‘CONFIDENTIAL’',
            'Encryption:  Enabling encryption on the column using pgsodium',
            'Faking: https://faker.readthedocs.io/en/master/locales/en_US.html#faker.providers.ssn.en_US.Provider.invalid_ssn ',
            'Masking: anon.partial(\'416-60-2011\',6,\'XXXXXX\',0) -> \'416-XX-XXXX\''
        ],
        defaultDescription: 'Destructions: Replace column with Static string like ‘CONFIDENTIAL’'
    },
    {
        policyName: 'Medical Record Number',
        policyDescription: [
            'Destructions: Replace column with Static string like ‘CONFIDENTIAL’',
            'Encryption:  Enabling encryption on the column using pgsodium',
            `Masking: anon.partial('1482928',4,'XXXX',0) -> '148XXXX'`
        ],
        defaultDescription: 'Destructions: Replace column with Static string like ‘CONFIDENTIAL’'
    },
    {
        policyName: 'Patient Account Number',
        policyDescription: [
            'Destructions: Replace column with Static string like ‘CONFIDENTIAL’',
            'Encryption:  Enabling encryption on the column using pgsodium',
            `Masking: anon.partial('1482928',4,'XXXX',0) -> '148XXXX'`
        ],
        defaultDescription: 'Destructions: Replace column with Static string like ‘CONFIDENTIAL’'
    },
    {
        policyName: 'Hospital Account Record (HAR)',
        policyDescription: [
            'Destructions: Replace column with Static string like ‘CONFIDENTIAL’',
            'Encryption:  Enabling encryption on the column using pgsodium',
            `Masking: anon.partial('1482928',4,'XXXX',0) -> '148XXXX'`
        ],
        defaultDescription: 'Destructions: Replace column with Static string like ‘CONFIDENTIAL’'
    },
    {
        policyName: 'Profile image(s)',
        policyDescription: [
            'Destructions: Replace column with Static string like ‘CONFIDENTIAL’'
        ],
        defaultDescription: 'Destructions: Replace column with Static string like ‘CONFIDENTIAL’'
    }
];