
module.exports  = [
    {packagePath: "../plugins/core"},
    {packagePath: "../plugins/test"},
    {packagePath: "../plugins/stripe"},
    {packagePath: "../plugins/updates", "interval" : 86400000, "master" : "https://hub.servicebot.io/api/v1/announcements"}
];