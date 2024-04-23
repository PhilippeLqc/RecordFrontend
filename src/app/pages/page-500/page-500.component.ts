import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/layouts/header/header.component";
import { FooterComponent } from "../../components/layouts/footer/footer.component";

@Component({
    selector: 'app-page-500',
    standalone: true,
    templateUrl: './page-500.component.html',
    styleUrl: './page-500.component.css',
    imports: [HeaderComponent, FooterComponent]
})
export class Page500Component {

}
