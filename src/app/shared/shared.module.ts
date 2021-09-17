import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { HeaderComponent } from './header/header.component';
import { MaterialModule } from '../material.module';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule
     ],
    declarations: [
      LoadingSpinnerComponent,
      HeaderComponent
    ],
    exports: [
      LoadingSpinnerComponent,
      HeaderComponent
    ],
})
export class SharedModule {}
