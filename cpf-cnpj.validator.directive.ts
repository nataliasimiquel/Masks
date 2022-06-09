import { Directive } from '@angular/core';
import { Validator, NG_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';

import { CpfCnpjValidator } from '@shared/cpf-cnpj.validator';

@Directive({
    selector: '[appCpfCnpjValidate][ngModel]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: CpfCnpjValidatorDirective,
        multi: true
    }]
})
export class CpfCnpjValidatorDirective extends CpfCnpjValidator implements Validator {}