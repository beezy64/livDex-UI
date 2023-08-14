import { Component, OnInit } from '@angular/core';
import { UploadService } from './service/upload.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  private readonly PLAYER_NAME_OFFSET = 0x2598;
  private readonly PLAYER_NAME_LENGTH = 0xB;
  private readonly PARTY_DATA_OFFSET = 0x2F2C;

  constructor(private readonly uploadService: UploadService) { }

  ngOnInit(): void {
  }

  processFile(event: any): void {
    console.log(event);
    if (event.files) {
      console.log('processing file...');
      this.uploadService.processSaveFile(event.files[0]);
    } else {
      console.log('no files detected');
    }
  }
}
