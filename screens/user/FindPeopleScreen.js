import React, {useState,useEffect, useCallback} from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
} from 'react-native';

import UserList from '../../components/UI/UserList';
import { useDispatch, useSelector } from 'react-redux';
import * as usersActions from '../../store/actions/users';
import Colors from '../../constants/Colors';

import { Container, Header, Item, Input, Icon, Button } from 'native-base';
import VerifiedUser from '../../constants/VerifiedUser';

const FindPeopleScreen = (props) => {

    // const findPeopleUsers = useSelector(state => state.users.findPeople);
    const findPeopleUsers = useSelector(state => state.users.allUsers.users);
    const totalCount = useSelector(state => state.users.allUsers.total_count);

    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState([]);

    const dispatch = useDispatch();


    const loadFindPeople = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            // const result = await dispatch(usersActions.fetchFindPeopleUsers());
            // const result = await dispatch(usersActions.fetchUsers());
            const result = {
                "users":
                [
                    {"id":1,"name":"Example User","gravatar_id":"bebfcf57d6d8277d806a9ef3385c078d","size":50},
                    {"id":2,"name":"Hosea West DO","gravatar_id":"03037e249b97891693d6e292289be0ff","size":50},
                    {"id":3,"name":"Madalyn Crist","gravatar_id":"2065436fdfe2d27dc7f06b6787a4a1af","size":50},
                    {"id":4,"name":"Jesse Marvin","gravatar_id":"4788f8d222055ddd54d12b75514cd8c3","size":50},
                    {"id":5,"name":"Nikole Schuster","gravatar_id":"b0e247198b823a9bd5908730477b2cc2","size":50}
                ],
                "total_count":101
            } 
            // let verifiedUsers =  result.users.filter(e => VerifiedUser.verifiedUsersId.includes(e.id));
            // let otherUsers = result.users.filter(e => !VerifiedUser.verifiedUsersId.includes(e.id));
            let verifiedUsers =  result.users.filter(e => ["1"].includes(e.id));
            let otherUsers = result.users.filter(e => !["1"].includes(e.id));
            let updatedResult = [...verifiedUsers, ...otherUsers];
            setData(updatedResult);
            // setData(result);
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError])

    
    useEffect(() => {
        setIsLoading(true);
        loadFindPeople()
        .then(() => {
            setIsLoading(false);
        });
    }, [dispatch, loadFindPeople])


    // useEffect(() => {
    //     const unsubscribe = props.navigation.addListener('focus', e => {
    //         setSearchText('');
    //         setData(findPeopleUsers);
    //     });
    //     return () => {
    //         unsubscribe();
    //     };
    // }, [])


    const handleSearchTextChange = (text) => {
        setSearchText(text);
        if(text !== ''){
            let filteredData = []
            let currData = findPeopleUsers;

            filteredData = currData.filter(item => {
                const lc = item.name.toLowerCase();
                const lcEmail = item.email.toLowerCase();
                text = text.toLowerCase();
                return lc.includes(text) || lcEmail.includes(text);
            });
            setData(filteredData);
        } else {
            setData(findPeopleUsers);
        }
    }


    const followHandlerForData = (id) => {
        //follow handler to remove item from search data i.e. data state
        let searchData = data;
        searchData = searchData.filter(i => i.id !== id);
        setData(searchData);
    }



    if(error){
        return (
            <View style={styles.centered} >
                <Text>An error occured.</Text>
                <Text>{error}</Text>
                <Text>{JSON.stringify(findPeopleUsers)}</Text>
                <Text>{totalCount}</Text>
                {/* <Text>{Object.keys(findPeopleUsers.users).length}</Text> */}
                {/* {
                    "users":
                    [
                        {"id":1,"name":"Example User","gravatar_id":"bebfcf57d6d8277d806a9ef3385c078d","size":50},
                        {"id":2,"name":"Hosea West DO","gravatar_id":"03037e249b97891693d6e292289be0ff","size":50},
                        {"id":3,"name":"Madalyn Crist","gravatar_id":"2065436fdfe2d27dc7f06b6787a4a1af","size":50},
                        {"id":4,"name":"Jesse Marvin","gravatar_id":"4788f8d222055ddd54d12b75514cd8c3","size":50},
                        {"id":5,"name":"Nikole Schuster","gravatar_id":"b0e247198b823a9bd5908730477b2cc2","size":50}
                    ],
                    "total_count":101
                } */}
                <Button onPress={loadFindPeople} color={Colors.primary} >
                    <Text>Try again</Text>
                </Button>
            </View>
        );
    }


    if(isLoading){
        return (
            <View style={styles.centered} >
                <ActivityIndicator size='large' color={Colors.primary} />
            </View>
        );
    }

    return (
        <Container style={{ backgroundColor: '#fff' }} >
            <Header style={{ backgroundColor: Colors.brightBlue }} searchBar rounded>
                <Item>
                    <Icon name="ios-search" />
                    <Input
                        value={searchText}
                        onChangeText={(text) => handleSearchTextChange(text)}
                        placeholder={`Search by name or email...`}
                    />
                    <Text>{data.length}</Text>
                    <Icon name="ios-people"  />
                </Item>
            </Header>
            { data.length === 0 && (
                <View style={styles.centered}>
                    <Text style={{ fontSize: 18, margin: 10 }} >No users found.</Text>
                    <Text>Either you are already following the user</Text>
                    <Text>or no user exists with that name.</Text>
                </View>
            ) }
            {/* <Text>{JSON.stringify(data)}</Text> */}
            <FlatList
                style={styles.list}
                refreshing={isRefreshing}
                onRefresh={loadFindPeople}
                contentContainerStyle={styles.listContainer}
                data={data}
                horizontal={false}
                numColumns={2}
                keyExtractor={(item) => {
                    return item._id;
                }}
                renderItem={({ item }) => (
                    <UserList item={item} followHandler={followHandlerForData} />
                )} 
            />
            {/* <UserList item={data[0]} followHandler={followHandlerForData} /> */}
        </Container>    
        // <></>
    );
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 30
    },
    container: {
        flex: 1,
    },
    list: {
        paddingHorizontal: 5,
        // backgroundColor: "#E6E6E6",
        backgroundColor: '#fff'
    },
    listContainer: {
        alignItems: 'center'
    },
});

export default FindPeopleScreen;