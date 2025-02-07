import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

interface WhitelistEntry {
  LP: string;
  KRS: string;
  NIP: string;
  Name: string;
  Voivodeship: string;
  County: string;
  Municipality: string;
  City: string;
}

export class WhitelistService {
  private whitelistedOrgs: Map<string, WhitelistEntry>;

  constructor() {
    const csvPath = path.join(__dirname, '../data/organizations_whitelist.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ',',
    }) as WhitelistEntry[];

    this.whitelistedOrgs = new Map(
      records.map((record) => [record.KRS, record])
    );
  }

  isKrsWhitelisted(krs: string): boolean {
    return this.whitelistedOrgs.has(krs);
  }

  getVoivodeshipForKrs(krs: string): string {
    return this.whitelistedOrgs.get(krs)?.Voivodeship || '';
  }
}
