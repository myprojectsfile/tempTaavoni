import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DarkhastType } from '../types/darkhast';
import { MoamelehType } from '../types/moameleh';
import { AuthService } from '../../auth/auth.service';
import { PortfoType } from '../types/portfo';
import { UserType } from '../types/user';
import { GheymatType } from '../types/gheymat';
import { ClaimType } from '../types/claim';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  apiUri = environment.apiUri;
  constructor(private httpClient: HttpClient, private authService: AuthService) {
  }

  getSafeKharid() {
    return this.httpClient.get<DarkhastType[]>(this.apiUri + '/safeKharid');
  }

  getSafeForush() {
    return this.httpClient.get<DarkhastType[]>(this.apiUri + '/safeForush');
  }

  sabtDarkhastKharid(darkhast: DarkhastType) {
    return this.httpClient.post(this.apiUri + '/safeKharid', darkhast);
  }

  sabtDarkhastForush(darkhast: DarkhastType) {
    return this.httpClient.post(this.apiUri + '/safeForush', darkhast);
  }

  getListDarkhast(noeDarkhast: string) {
    if (noeDarkhast == 'kharid') {
      return this.httpClient.get<DarkhastType[]>(this.apiUri + '/safeKharid');
    }
    else return this.httpClient.get<DarkhastType[]>(this.apiUri + '/safeForush');
  }

  getTedadKolSahamForushUser() {
    let username = this.authService.getUsername();
    return this.httpClient.get<number[]>(this.apiUri + '/safeForush/tedadKolSahamForushUser/' + username);
  }

  updateDarkhastById(darkhast: DarkhastType, id: string) {
    return this.httpClient.put<DarkhastType>(this.apiUri + '/darkhast/' + id, darkhast);
  }

  getMoameleh() {
    return this.httpClient.get<MoamelehType[]>(this.apiUri + '/moameleh');
  }

  getMoamelehById(id: string) {
    return this.httpClient.get<MoamelehType[]>(this.apiUri + '/moameleh/' + id);
  }

  deleteMoamehById(id: string) {
    return this.httpClient.delete(this.apiUri + '/moameleh/' + id);
  }

  updateMoamelehById(moameleh: MoamelehType, id: string) {
    return this.httpClient.put<MoamelehType>(this.apiUri + '/moameleh/' + id, moameleh);
  }

  sabtMoameleh(moameleh: MoamelehType) {
    return this.httpClient.post<MoamelehType>(this.apiUri + '/moameleh', moameleh);
  }

  getListDarkhastUser() {
    const username = this.authService.getUsername();
    return this.httpClient.get<DarkhastType[]>(this.apiUri + '/darkhast/byUsername/' + username);
  }

  updateDarkhast(darkhast: DarkhastType, rowKey: string) {
    return this.httpClient.put(this.apiUri + '/darkhast/' + rowKey, darkhast);
  }

  getUserPortfo() {
    const username = this.authService.getUsername();
    return this.httpClient.get<PortfoType>(this.apiUri + '/portfo/byUsername/' + username);
  }

  getUserPortfoDarayi() {
    const username = this.authService.getUsername();
    return this.httpClient.get<PortfoType[]>(this.apiUri + '/portfo/darayi/byUsername/' + username);
  }

  // User methods
  getUserByUsername(username: string) {
    return this.httpClient.get<UserType[]>(this.apiUri + '/user/byUsername/' + username);
  }

  async getUserByUsernameAsync(username: string) {
    let result = await this.httpClient.get<UserType[]>(this.apiUri + '/user/byUsername/' + username).toPromise();
    return result;
  }

  getUserByCodeMelli(codeMelli: string) {
    return this.httpClient.get<UserType[]>(this.apiUri + '/user/byCodeMelli/' + codeMelli);
  }
  
  async getUserByCodeMelliAsync(codeMelli: string) {
    let result=await this.httpClient.get<UserType[]>(this.apiUri + '/user/byCodeMelli/' + codeMelli).toPromise();
    return result;
  }

  getUserById(id: string) {
    return this.httpClient.get<UserType>(this.apiUri + '/user/' + id);
  }

  CheckUserExistByUsernameOrCodemelli(username, codeMelli) {
    return this.httpClient.get<UserType>(this.apiUri + `/user/byUsername/${username}/byCodeMelli/${codeMelli}`);
  }

  updateUserById(user: UserType, id: string) {
    return this.httpClient.put<UserType>(this.apiUri + '/user/' + id, user);
  }

  updateUserPassById(user: UserType, id: string) {
    return this.httpClient.put<UserType>(this.apiUri + '/user/updatePass/' + id, user);
  }

  // Profile methods
  getPortfohByUsername(username: string) {
    return this.httpClient.get<PortfoType>(this.apiUri + '/portfo/byUsername/' + username);
  }

  updatePortfoById(portfo: PortfoType, id: string) {
    return this.httpClient.put<PortfoType>(this.apiUri + '/portfo/' + id, portfo);
  }

  sabtPortfo(portfo: PortfoType) {
    return this.httpClient.post(this.apiUri + '/portfo', portfo);
  }

  checkUserHasNoActiveCrossRequest(noeDarkhast: number) {
    const username = this.authService.getUsername();
    return this.httpClient.get(this.apiUri + `/darkhast/hasNoActiveRequest/noeDarkhast/${noeDarkhast}/byUsername/${username}`);
  }

  // claim methods
  getClaimList() {
    return this.httpClient.get<ClaimType[]>(this.apiUri + '/claim');
  }
  // gheymatRoozSahm

  getAkharinGheymatSahm() {
    return this.httpClient.get<GheymatType>(this.apiUri + '/gheymatRoozSahm/akharinGheymat');
  }

  sabtGheymatSahm(gheymat: GheymatType) {
    return this.httpClient.post(this.apiUri + '/gheymatRoozSahm', gheymat);
  }

  findUser(username: string, codeMelli: string) {

  }

  // file upload methods
  
}
