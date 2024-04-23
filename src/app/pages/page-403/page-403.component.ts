import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/layouts/header/header.component";
import { FooterComponent } from "../../components/layouts/footer/footer.component";

@Component({
    selector: 'app-page-403',
    standalone: true,
    templateUrl: './page-403.component.html',
    styleUrl: './page-403.component.css',
    imports: [HeaderComponent, FooterComponent]
})
export class Page403Component {

}
