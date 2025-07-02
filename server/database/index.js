const { Sequelize, DataTypes } = require("sequelize");
require('dotenv').config();
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;   
const DB_PASSWORD = process.env.DB_PASSWORD; 
const DB_HOST = process.env.DB_HOST; 
const DB_DIALECT = process.env.DB_DIALECT; 

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD || null, {
  host: DB_HOST,
  dialect: DB_DIALECT,
});

const db = {};
db.sequelize = sequelize;

db.User = require("../models/userModels")(sequelize, DataTypes);;
db.Community = require("../models/communityModel")(sequelize, DataTypes);
db.Campaign = require("../models/campaignModel")(sequelize, DataTypes);
db.Contribution = require("../models/contributionModel")(sequelize, DataTypes);
db.CommunityCampaign = require("../models/communityCampaignModel")(sequelize, DataTypes);
db.CommunityMemberModel = require("../models/communityMemberModel")(sequelize, DataTypes);
db.CommunityInvitation = require("../models/communityInvitationModel")(sequelize, DataTypes);
db.Post = require("../models/postModel")(sequelize, DataTypes);
// db.User.hasMany(db.Community);
 

db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);

db.Community.hasMany(db.Post);
db.Post.belongsTo(db.Community);

db.Community.belongsToMany(db.User, { through: db.CommunityMemberModel });
db.User.belongsToMany(db.Community, { through: db.CommunityMemberModel });

// db.Community.hasMany(db.Campaign);
db.Campaign.belongsToMany(db.Community, { through: db.CommunityCampaign });
db.Community.belongsToMany(db.Campaign, { through: db.CommunityCampaign });

db.User.hasMany(db.Contribution);
db.Contribution.belongsTo(db.User);


db.User.hasMany(db.Campaign);
db.Campaign.belongsTo(db.User);



db.Campaign.hasMany(db.Contribution);
db.Contribution.belongsTo(db.Campaign);

// Community Invitation relationships
db.User.hasMany(db.CommunityInvitation, { as: 'SentInvitations', foreignKey: 'inviterId' });
db.CommunityInvitation.belongsTo(db.User, { as: 'Inviter', foreignKey: 'inviterId' });

db.User.hasMany(db.CommunityInvitation, { as: 'ReceivedInvitations', foreignKey: 'inviteeId' });
db.CommunityInvitation.belongsTo(db.User, { as: 'Invitee', foreignKey: 'inviteeId' });

db.Community.hasMany(db.CommunityInvitation);
db.CommunityInvitation.belongsTo(db.Community);





sequelize
  .authenticate()
  .then(() => {
    console.log("db connected successfully");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });


sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database & tables synchronized!");
  })
  .catch((error) => {
    console.error("Error synchronizing database & tables:", error);
   }); 

module.exports = db;