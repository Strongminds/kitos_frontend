import { Injectable } from '@angular/core';
import { ODataSettings } from '@progress/kendo-data-query/dist/npm/odata.operators';
import { GRID_DATA_CACHE_CHUNK_SIZE } from '../constants/constants';
import { GridState, toODataString } from '../models/grid-state.model';

interface GridDataCache {
  chunks: (GridDataCacheChunk | undefined)[];
  total: number;
}

export interface GridDataCacheChunk {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
}
@Injectable({
  providedIn: 'root',
})
export class GridDataCacheService {
  private chunkSize = GRID_DATA_CACHE_CHUNK_SIZE;
  private cache: GridDataCache = {
    chunks: [],
    total: 0,
  };

  constructor() {}

  public get(gridState: GridState) {
    const cacheChunks = this.cache.chunks;
    if (cacheChunks.length === 0) return undefined;

    const cacheStartIndex = this.getCacheStartIndex(gridState);
    const chunkCount = this.getChunkCount(gridState);

    const chunksInSlice = cacheChunks
      .slice(cacheStartIndex, cacheStartIndex + chunkCount)
      .filter((chunk) => chunk !== undefined);

    if (chunksInSlice.length !== chunkCount) return undefined;

    return this.sliceDataFromChunks(chunksInSlice, gridState);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sliceDataFromChunks(chunks: GridDataCacheChunk[], gridState: GridState) {
    const concatenatedData = [];
    for (const chunk of chunks) {
      if (chunk === undefined) {
        return undefined;
      }
      concatenatedData.push(...chunk.data);
    }

    const chunkSkip = this.getChunkSkip(gridState.skip);
    const startSlice = (gridState.skip ?? 0) - chunkSkip;
    const endSlice = startSlice + (gridState.take ?? 0);
    return concatenatedData.slice(startSlice, endSlice);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public set(gridState: GridState, data: any[], total: number) {
    let cacheIndex = this.getCacheStartIndex(gridState);
    const passesToDo = data.length / this.chunkSize;

    for (let i = 0; i < passesToDo; i++) {
      this.cache.chunks[cacheIndex++] = {
        data: data.slice(i * this.chunkSize, i + 1 * this.chunkSize),
      };
    }
    this.cache.total = total;
  }

  public tryResetOnGridStateChange(currState: GridState, prevState: GridState) {
    if (this.shouldResetOnGridStateChange(currState, prevState)) {
      this.reset();
    }
  }

  public reset() {
    console.log('cahce resetting at ' + new Date().toLocaleTimeString());
    if (!this.isEmpty()) {
      this.cache = {
        chunks: [],
        total: 0,
      };
    }
  }

  private isEmpty() {
    return this.cache.chunks.length === 0 && this.cache.total === 0;
  }

  public getTotal() {
    return this.cache.total;
  }

  public shouldResetOnGridStateChange(newState: GridState, previousState: GridState) {
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

  private getChunkSkip(skip: number | undefined) {
    return Math.floor((skip ?? 0) / this.chunkSize) * this.chunkSize;
  }

  private getChunkTake(gridState: GridState) {
    const skip = gridState.skip ?? 0;
    const take = gridState.take ?? 0;
    const chunkSkip = this.getChunkSkip(gridState.skip);
    return Math.ceil((skip + take) / this.chunkSize) * this.chunkSize - chunkSkip;
  }

  private getCacheStartIndex(gridState: GridState) {
    return this.getChunkSkip(gridState.skip) / this.chunkSize;
  }

  private getChunkCount(gridState: GridState) {
    const chunkTake = this.getChunkTake(gridState);
    return chunkTake / this.chunkSize;
  }

  public toCacheableODataString(gridState: GridState, settings?: ODataSettings) {
    const chunkSkip = this.getChunkSkip(gridState.skip);
    const chunkTake = this.getChunkTake(gridState);
    console.log('skip ' + chunkSkip + ' take ' + chunkTake);
    const cacheableGridState = {
      ...gridState,
      skip: chunkSkip,
      take: chunkTake,
    };
    return toODataString(cacheableGridState, settings);
  }
}
