import { Component, Inject, OnInit } from "@angular/core";
import { SHARED_IMPORTS, SHARED_PROVIDERS } from "../../shared/shared-imports";
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService } from "@azure/msal-angular";
import { RedirectRequest } from "@azure/msal-browser";

@Component({
  selector: 'app-ad-login',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  providers: [...SHARED_PROVIDERS, MsalService],
  templateUrl: './ad-login.component.html',
  styleUrls: ['./ad-login.component.scss']
})

export class AdLoginComponent implements OnInit{
  
    constructor(
    private msalService: MsalService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration
  ) {}

  ngOnInit(): void {
    alert('hello')
    const request: RedirectRequest | undefined = this.msalGuardConfig.authRequest as RedirectRequest;
    if (request) {
      console.log(request);
      this.msalService.loginRedirect(request);
    } else {
      this.msalService.loginRedirect();
    }
  }
}