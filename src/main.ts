import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { SSAuthentication } from "src/app/static-stack/authentication";
import { SSIpfs } from 'src/app/static-stack/ipfs';
import { SSOrbitdb } from 'src/app/static-stack/orbitdb';

import { MatchMediaUtil } from "src/app/shared/match-media-util";

if (environment.production) {
  enableProdMode();
} else {
  window['__main'] = {
    SSOrbitdb: SSOrbitdb,
    SSAuthentication: SSAuthentication,
    SSIpfs: SSIpfs
  }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

// MatchMediaUtil.setPrefersColorsScheme();
// setInterval(() => {
//   MatchMediaUtil.setPrefersColorsScheme();
// }, 1000);


