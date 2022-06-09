import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from '@shared/dialogs';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SorteioResult } from '../state/sorteio-result.model';
import { SorteioService } from '../state/sorteio.service';
import { ActivityIndicatorOverlayService } from '@havan/activity-indicator-overlay';
import { CpfCnpjValidator } from '@shared/validators/cpf-cnpj.validator';

const maskTelefoneSm = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /(\d)?/];
const maskTelefoneLg = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy {

  form: FormGroup;

  textMaskTelefone$: BehaviorSubject<{ mask: (RegExp | string)[], guide: boolean }>;

  textMaskCpf = {
    mask: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/],
    guide: false,
  };

  /**
   *
   */
  constructor(
    private readonly _sorteio: SorteioService,
    private readonly _dialog: MatDialog,
    private readonly _aio: ActivityIndicatorOverlayService,
  ) {
    const cpfValidators = [
      Validators.required,
      Validators.pattern(/^(\d{3}\.){2}\d{3}\-\d{2}$/),
      CpfCnpjValidator.validateCpf
    ];

    const cpfField = new FormControl(null, cpfValidators);
    const nomeField = new FormControl(null, Validators.required);
    const emailField = new FormControl(null, Validators.email);
    const telefoneField = new FormControl(null, Validators.required);

    this.form = new FormGroup({ cpfField, nomeField, emailField, telefoneField });

    this.textMaskTelefone$ = new BehaviorSubject({ mask: maskTelefoneSm, guide: false });
  }

  /**
   * Lifecycle hook.
   */
  ngOnDestroy(): void {
    // this._subs.unsubscribe();
  }

  onSubmitForm(): void {
    if (!this.form.valid) {
      this._dialog.open(AlertDialogComponent, {
        data: {
          content: 'Formulario invalido'
        }
      });
    }

    this._aio.open();

    const formData = this.form.value;

    const data = {
      cpf: formData.cpfField,
      email: formData.emailField,
      telefone: formData.telefoneField,
      nome: formData.nomeField,
    };

    this._sorteio.participar(data)
      .pipe(finalize(() => this._aio.close()))
      .subscribe(
        resposta => this._dialogSorteioSuccess(resposta),
        err => this._dialogSorteioError(err),
      );
  }

  onTelefonePress(value: string) {
    this._nextTelefoneMask((value || '').replace(/\D/g, '').length);
  }

  private _dialogSorteioError(err: SorteioResult): void {

    if (!err.Mensagem) { return; }

    this._dialog.open(AlertDialogComponent, {
      data: {
        content: err.Mensagem,
      }
    });
  }

  private _dialogSorteioSuccess(resposta: SorteioResult): void {
    this._dialog.open(AlertDialogComponent, { data: { content: resposta.Mensagem } });
  }

  private _nextTelefoneMask(telefoneLength: number): void {
    const mask = this._getTelefoneMask(telefoneLength);
    const guide = false;
    this.textMaskTelefone$.next({ mask, guide });
  }

  private _getTelefoneMask(telefoneLength: number): (RegExp | string)[] {
    return telefoneLength < 10 ? maskTelefoneSm : maskTelefoneLg;
  }
}
