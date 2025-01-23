import { Injectable } from '@angular/core';

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
    this.cache = {
      chunks: [],
      total: 0,
    };
  }

  public getTotal() {
    return this.cache.total;
  }
}
