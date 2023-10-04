import { IJSONMemoryStoreConfig, IMemoryStoreType, JsonMemoryStore } from '../src/JSONMemoryStore';
import fs from 'fs';


function setTestJSON<T>(config: IJSONMemoryStoreConfig<T>, data: any[]){
    fs.writeFileSync(config.filePath+'\\TestJSON.json', JSON.stringify(data), 'utf8');
}

function getTestConfig() {
    return {
        filePath: 'C:\\Users\\johnd\\Desktop\\GitHub\\Reusables\\jsonmemorystore\\test',
        initialData: [],
        dataFileName: 'TestJSON'
    }
}


//loadDataFromFile
test('loadDataFromFile', () => {
    interface Itest{
        id: number;
    }

    let config: IJSONMemoryStoreConfig<IMemoryStoreType<Itest>> = getTestConfig();
    setTestJSON(config, [{key: 1, value:{
        id: 2
    }}, {key: 2, value:{
        id: 3
    }}]);
    let memstore = new JsonMemoryStore(config);
    expect(memstore.read()).toStrictEqual([{key: 1, value:{
        id: 2
    }}, {key: 2, value:{
        id: 3
    }}]);
});

//saveDataToFile
test('saveDataToFile', () => {
    // BROKEN  FOR NOW: TODO
    interface Itest{
        id: number;
    }

    let config: IJSONMemoryStoreConfig<Itest> = getTestConfig();
    // make sure TestJSON is empty
    setTestJSON(config, []);

    let memstore = new JsonMemoryStore<Itest>(config); // Specify the generic type parameter
    let test: IMemoryStoreType<Itest> = {
        key: 2,
        value: {
            id: 2
        }
    }
    memstore.add(test)

    // create new instance to kick off loadDataToFile and see if added data is there
    let newmemstore = new JsonMemoryStore<Itest>(config);
    expect(newmemstore.read()).toEqual([test])
});

//add
test('add', () => {
    interface Itest{
        id: number;
    }

    let config: IJSONMemoryStoreConfig<Itest> = getTestConfig();
    // make sure TestJSON is empty
    setTestJSON(config, []);

    let memstore = new JsonMemoryStore<Itest>(config);
    memstore.add({key: 1, value:{
        id: 26
    }})
    memstore.add({key: 2, value:{
        id: 27
    }})
    memstore.add({key: 3, value:{
        id: 28
    }})
    memstore.add({key: 4, value:{
        id: 29
    }})
    expect(memstore.read()).toEqual([{key: 1, value:{
        id: 26
    }},{key: 2, value:{
        id: 27
    }},{key: 3, value:{
        id: 28
    }},{key: 4, value:{
        id: 29
    }}])
});

test('add', () => {
    interface User{
        Id: number,
        Username: string,
        UserDetailId: number,
        AdminId: number
    }

    let config: IJSONMemoryStoreConfig<User> = getTestConfig();
    // make sure TestJSON is empty
    setTestJSON(config, []);

    let memstore = new JsonMemoryStore<User>(config);
    
    let arr = [
    {
        key: 3124356, value:{
        Id: 3124356,
        Username: 'TESTUSR',
        UserDetailId: 44,
        AdminId: 88}
    },
    {
        key: 631245, value:{
        Id: 631245,
        Username: 'JOHND',
        UserDetailId: 22,
        AdminId: 16 }
    },
    {
        key: 712048, value:{
        Id: 712048,
        Username: 'KYS',
        UserDetailId: 18,
        AdminId: 17 }
    },
    {
        key: 9028127, value:{
        Id: 9028127,
        Username: 'ggOnlyJhf',
        UserDetailId: 20,
        AdminId: 19 } 
    } ]

    // adds
    memstore.add(arr[0])
    memstore.add(arr[1])
    memstore.add(arr[2])
    memstore.add(arr[3])

    expect(memstore.read()).toEqual([arr[0], arr[1], arr[2], arr[3]])
    try{
        memstore.add(arr[3]);
        expect("false").toBe('Duplicate Key');
    }catch(e: any){
        expect(e.message).toBe('Duplicate Key');
    }
    
});


//delete
test('delete', () => {
    interface Itest{
        id: string;
    }

    let config: IJSONMemoryStoreConfig<Itest> = getTestConfig();
    // make sure TestJSON is empty
    setTestJSON(config, []);

    let memstore = new JsonMemoryStore<Itest>(config);
    memstore.add({key: 1, value:{
        id: '26'
    }})
    memstore.add({key: 2, value:{
        id: '27'
    }})
    memstore.add({key: 3, value:{
        id: '28'
    }})
    memstore.add({key: 4, value:{
        id: '29'
    }})
    memstore.delete({key: 4, value:{
        id: '29'
    }})
    expect(memstore.read()).toEqual([{key: 1, value:{
        id: '26'
    }},{key: 2, value:{
        id: '27'
    }},{key: 3, value:{
        id: '28'
    }}])
});

//delete
test('delete', () => {
    interface User{
        Id: number,
        Username: string,
        UserDetailId: number,
        AdminId: number
    }

    let config: IJSONMemoryStoreConfig<User> = getTestConfig();
    // make sure TestJSON is empty
    setTestJSON(config, []);

    let memstore = new JsonMemoryStore<User>(config);

    let arr = [
        {
            key: 3124356, value:{
            Id: 3124356,
            Username: 'TESTUSR',
            UserDetailId: 44,
            AdminId: 88}
        },
        {
            key: 631245, value:{
            Id: 631245,
            Username: 'JOHND',
            UserDetailId: 22,
            AdminId: 16 }
        },
        {
            key: 712048, value:{
            Id: 712048,
            Username: 'KYS',
            UserDetailId: 18,
            AdminId: 17 }
        },
        {
            key: 9028127, value:{
            Id: 9028127,
            Username: 'ggOnlyJhf',
            UserDetailId: 20,
            AdminId: 19 } 
        } ]

    // adds
    memstore.add(arr[0])
    memstore.add(arr[1])
    memstore.add(arr[2])
    memstore.add(arr[3])
    

    memstore.delete(arr[0])
    expect(memstore.read()).toEqual([arr[1], arr[2], arr[3]])

    memstore.delete(arr[1])
    expect(memstore.read()).toEqual([arr[2], arr[3]])

    memstore.delete(arr[2])
    expect(memstore.read()).toEqual([arr[3]])

    memstore.delete(arr[3])
    expect(memstore.read()).toEqual([])

});