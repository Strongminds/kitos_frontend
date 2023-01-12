import { Component, OnInit } from '@angular/core';
import { ITSystemService } from 'src/app/store/it-system/it-system.service';

@Component({
  templateUrl: 'it-systems.component.html',
  styleUrls: ['it-systems.component.scss'],
})
export class ItSystemsComponent implements OnInit {
  loading$ = this.itSystemService.loading$;
  itSystems$ = this.itSystemService.entities$;

  constructor(private itSystemService: ITSystemService) {}

  ngOnInit() {
    this.itSystemService.getAll();
  }
}
