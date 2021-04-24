function makeIncidentsArray() {
    return [
        {
            id: 1,
            user_id: 1,
            user_name: "testUser1",
            time_of_incident: "2021-04-20T04:38:50.000Z",
            type: "gender",
            description: "Lorem isump erver qerve ev4v tver",
            coordinates: [-74.9876543211234,45.122121536272049],
            created_at: "2021-04-22T08:55:08.173Z"
        },
        {
            id: 2,
            user_id: 1,
            user_name: "testUser1",
            time_of_incident: "2021-04-22T04:38:50.000Z",
            type: "sexual",
            description: "Lorem isump erver qerve ev4v tver",
            coordinates: [-75.7876543211234,45.522121536272049],
            created_at: "2021-04-21T08:55:08.173Z"
        },
        {
            id: 3,
            user_id: 2,
            user_name: "testUser2",
            time_of_incident: "2021-04-19T04:38:50.000Z",
            type: "race",
            description: "Lorem isump erver qerve ev4v tver",
            coordinates: [-75.6876543211234,45.622121536272049],
            created_at: "2021-04-20T08:55:08.173Z"
        },
        {
            id: 4,
            user_id: 2,
            user_name: "testUser2",
            time_of_incident: "2021-04-17T04:38:50.000Z",
            type: "verbal",
            description: "Lorem isump erver qerve ev4v tver",
            coordinates: [-75.5876543211234,45.722121536272049],
            created_at: "2021-04-19T08:55:08.173Z"
        },
        {
            id: 5,
            user_id: 3,
            user_name: "testUser3",
            time_of_incident: "2021-04-01T03:38:50.000Z",
            type: "physical",
            description: "Lorem isump erver qerve ev4v tver",
            coordinates: [-75.4876543211234,45.822121536272049],
            created_at: "2021-04-18T08:55:08.173Z"
        },
        {
            id: 6,
            user_id: 4,
            user_name: "testUser4",
            time_of_incident: "2021-04-11T04:38:50.000Z",
            type: "gender",
            description: "Lorem isump erver qerve ev4v tver",
            coordinates: [-75.2876543211234,45.922121536272049],
            created_at: "2021-04-17T08:55:08.173Z"
        },
        {
            id: 7,
            user_id: 5,
            user_name: "testUser5",
            time_of_incident: "2021-04-22T09:00:00.000Z",
            type: "gender",
            description: "",
            coordinates: [-74.47606660156234,45.070533083787325],
            created_at: "2021-04-16T08:55:08.173Z"
        },
        {
            id: 8,
            user_id: 5,
            user_name: "testUser5",
            time_of_incident: "2021-04-21T09:00:00.000Z",
            type: "gender",
            description: "",
            coordinates: [-72.47606660156234,45.070533083787325],
            created_at: "2021-04-15T08:55:08.173Z"
        },
        {
            id: 9,
            user_id: 5,
            user_name: "testUser5",
            time_of_incident: "2021-04-21T08:00:00.000Z",
            type: "gender",
            description: "",
            coordinates: [-76.47606660156234,45.070533083787325],
            created_at: "2021-04-14T08:55:08.173Z"
        },
    ]
}

module.exports = {
    makeIncidentsArray
}