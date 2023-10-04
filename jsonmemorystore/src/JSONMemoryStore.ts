import fs from 'fs';

export interface IJSONMemoryStoreConfig<T>{
    filePath: string;
    dataFileName: string;
    initialData?: IMemoryStoreType<T>[];
}
export interface IMemoryStoreType<T>{
    key: number;
    value: T;
}

export class JsonMemoryStore<T> {
    private config: IJSONMemoryStoreConfig<T>;
    private dataMap: Map<any, T> = new Map();
    private fullDataFilePath: string;
  
    constructor(config: IJSONMemoryStoreConfig<T>) {
      this.config = config;
      this.fullDataFilePath = this.config.filePath + '\\' + this.config.dataFileName+'.json';
      // Load data from the JSON file into this.data in the constructor
      this.loadDataFromFile();
    }
  
    private loadDataFromFile() {
      // config contains initial data add it to the store
      if(this.config.initialData){
        this.config.initialData.forEach((item: IMemoryStoreType<T>) => {
            this.add(item);
          });
      }

      const jsonData = fs.readFileSync(this.fullDataFilePath, 'utf-8');
      const parsedData = JSON.parse(jsonData);

      parsedData.forEach((item: IMemoryStoreType<T>) => {
        this.add(item);
      });
    }
  
    private saveDataToFile() {
      let json = JSON.stringify(Array.from(this.dataMap));

      fs.writeFileSync(this.fullDataFilePath, json, 'utf8')
    }
  
    // CRUD operations
    add(item: IMemoryStoreType<T>) {
      if(this.dataMap.has(item.key)){
        throw new Error('Duplicate Key');
      } else{
        this.dataMap.set(item.key, item.value);
        this.saveDataToFile();
      }
    }
  
    read(): IMemoryStoreType<T>[] {
      return Array.from(this.dataMap, ([key, value]) => ({ key, value }));
    }
  
    update(item: IMemoryStoreType<T>) {
      if(this.dataMap.has(item.key)){
        this.dataMap.set(item.key, item.value);
        this.saveDataToFile();
      } else{
        throw new Error('Item not found');
      }
    }
  
    delete(item: IMemoryStoreType<T>) {
      if(this.dataMap.has(item.key)){
        this.dataMap.delete(item.key);
      } else{
        throw new Error('Item not found');
      }
    }
  }
  
  