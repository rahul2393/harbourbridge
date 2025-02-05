import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import IDumpConfig from 'src/app/model/dump-config'
import { DataService } from 'src/app/services/data/data.service'
import { Router } from '@angular/router'
import { InputType, StorageKeys } from 'src/app/app.constants'
import { extractSourceDbName } from 'src/app/utils/utils'
import { ClickEventService } from 'src/app/services/click-event/click-event.service'

@Component({
  selector: 'app-load-dump',
  templateUrl: './load-dump.component.html',
  styleUrls: ['./load-dump.component.scss'],
})
export class LoadDumpComponent implements OnInit {
  constructor(
    private data: DataService,
    private router: Router,
    private clickEvent: ClickEventService
  ) {}
  connectForm = new FormGroup({
    dbEngine: new FormControl('mysqldump', [Validators.required]),
    filePath: new FormControl('', [Validators.required]),
  })
  dbEngineList = [
    { value: 'mysqldump', displayName: 'MYSQL' },
    { value: 'pg_dump', displayName: 'PostgreSQL' },
  ]

  ngOnInit(): void {}

  convertFromDump() {
    this.clickEvent.openDatabaseLoader('dump', '')
    this.data.resetStore()
    const { dbEngine, filePath } = this.connectForm.value
    const payload: IDumpConfig = {
      Driver: dbEngine,
      Path: filePath,
    }
    this.data.getSchemaConversionFromDump(payload)
    this.data.conv.subscribe((res) => {
      localStorage.setItem(StorageKeys.Config, JSON.stringify(payload))
      localStorage.setItem(StorageKeys.Type, InputType.DumpFile)
      localStorage.setItem(StorageKeys.SourceDbName, extractSourceDbName(dbEngine))
      this.clickEvent.closeDatabaseLoader()
      this.router.navigate(['/workspace'])
    })
  }
}
