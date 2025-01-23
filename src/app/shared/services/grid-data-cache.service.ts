import { Injectable } from '@angular/core';
import { GridState } from '../models/grid-state.model';

interface GridDataCache {
  chunks: (GridDataCacheChunk | undefined)[];
  total: number;
}

export interface GridDataCacheChunk {
  skip: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
}
@Injectable({
  providedIn: 'root',
})
export class GridDataCacheService {

  private cache: GridDataCache = {
    chunks: [],
    total: 0,
  };

  constructor() {}

  public get(startIndex: number, chunkCount: number) {
    const cachedChunks = this.cache.chunks;
    if (cachedChunks.length === 0) return undefined;
    const chunksInSlice = cachedChunks
      .slice(startIndex, startIndex + chunkCount)
      .filter((chunk) => chunk !== undefined);

    if (chunksInSlice.length !== chunkCount) return undefined;

    const concatenatedData = [];

    for (const chunk of chunksInSlice) {
      if (chunk === undefined) {
        return undefined;
      }
      concatenatedData.push(...chunk.data);
    }
    return concatenatedData;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public set(index: number, data: any[], total: number) {
    this.cache.total = total;
    let currentPass = 0;
    const passesToDo = data.length / 50;
    while (currentPass < passesToDo) {
      this.cache.chunks[index] = {
        skip: index++ * 50,
        data: data.slice(currentPass * 50, ++currentPass * 50),
      };
    }
  }

  public reset() {
    console.log('cahce resetting at ' + new Date().toLocaleTimeString());
    if (!this.isEmpty()){
      this.cache = {
        chunks: [],
        total: 0,
      };
    }
  }

  private isEmpty(){
    return this.cache.chunks.length === 0 && this.cache.total === 0;
  }

  public getTotal() {
    return this.cache.total;
  }

  public shouldResetOnGridStateChange(newState: GridState, previousState: GridState){
    //todo make more concise with json stringify loop?

    // Compare 'take'
    if (newState.take !== previousState.take) {
      return true;
    }

    // Compare 'all'
    if (newState.all !== previousState.all) {
      return true;
    }

    // Compare 'sort'
    if (JSON.stringify(newState.sort) !== JSON.stringify(previousState.sort)) {
      return true;
    }

    // Compare 'filter'
    if (JSON.stringify(newState.filter) !== JSON.stringify(previousState.filter)) {
      return true;
    }

    // Compare 'group'
    if (JSON.stringify(newState.group) !== JSON.stringify(previousState.group)) {
      return true;
    }

    // If none of the properties other than 'skip' differ, return false
    return false;
  }
}
