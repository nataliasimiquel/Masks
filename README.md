# Exemplos

## Uso com reactive forms

```typescript
new FormGroup({
    cpfManualLength: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(\d{3}\.){2}\d{3}\-\d{2}$/),
        Validators.minLength(14), // digits + word characters
        Validators.maxLength(14), // digits + word characters
        CpfCnpjValidator.validate,
    ]),
    cpf: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(\d{3}\.){2}\d{3}\-\d{2}$/),       
        CpfCnpjValidator.validateCpf,
    ]),
    cnpj: new FormControl('', [
        Validators.required,
        // @todo add CNPJ pattern
        CpfCnpjValidator.validateCnpj,
    ]),
});
```

## Uso com template driven forms

Inclua a directive `CpfCnpjValidatorDirective` no módulo onde você deseja utilizá-la e use +- como o seguinte:

```typescript
<mat-form-field appearance="outline">

    <mat-label>CPF</mat-label>
    <input matInput name="cpf" type="tel" appCpfCnpjValidate length="14" [textMask]="maskCpfOptions" placeholder="000.000.000-00">

    <mat-hint align="start" *ngIf="formSignInGroup.get('cpf').invalid">xxx.xxx.xxx-xx</mat-hint>
    <mat-hint align="end">{{ getNumericCharsLength(formSignInGroup.get('cpf').value) }} / 11</mat-hint>

    <mat-error align="start" *ngIf="formSignInGroup.get('cpf').hasError('digit')">CPF inválido.</mat-error>

</mat-form-field>
```

## Referências

- https://angular.io/api/forms/Validator
- https://codecraft.tv/courses/angular/advanced-topics/basic-custom-validators/
- https://dzone.com/articles/how-to-create-custom-validators-in-angular