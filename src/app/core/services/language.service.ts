import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppLanguage } from '../enums/language.enum';
import { LocalStorageKeys } from '../enums/local-storage.enum';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  public readonly lang: WritableSignal<AppLanguage> = signal<AppLanguage>(AppLanguage.EN);
  private readonly translate: TranslateService = inject(TranslateService);

  constructor() {
    const storedLang: AppLanguage = (localStorage.getItem(LocalStorageKeys.Language) as AppLanguage) || AppLanguage.EN;
    this.setLanguage(storedLang);
    this.lang.set(storedLang);
  }

  public switchLang(lang: AppLanguage): void {
    this.lang.set(lang);
    this.setLanguage(lang);
    localStorage.setItem(LocalStorageKeys.Language, lang);
  }

  private setLanguage(lang: AppLanguage): void {
    this.translate.setDefaultLang(AppLanguage.EN);
    this.translate.use(lang);
  }
}
