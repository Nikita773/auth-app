import { Component, computed, inject, Signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { AppLanguage } from '../../core/enums/language.enum';
import { MockUser } from '../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [NgOptimizedImage, TranslatePipe, NgClass],
})
export class NavbarComponent {
  protected readonly user: Signal<MockUser | null> = computed(() => this.auth.user() || null);
  protected readonly initials: Signal<string> = computed(() => this.user()?.fullName?.charAt(0) || '');
  protected readonly AppLanguage: typeof AppLanguage = AppLanguage;
  private readonly auth: AuthService = inject(AuthService);
  private readonly langService: LanguageService = inject(LanguageService);

  protected get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  protected get currentLanguage(): AppLanguage {
    return this.langService.lang();
  }

  protected switchLang(lang: AppLanguage): void {
    this.langService.switchLang(lang);
  }

  protected logout(): void {
    this.auth.logout();
  }
}
