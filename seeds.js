var mongoose = require("mongoose");
var Post = require("./models/post");
var Comment    = require("./models/comment");

var data = [
    {
        name: "Bhushi Dam",
        image: "https://res.cloudinary.com/thrillophilia/image/upload/c_fill,f_auto,fl_progressive.strip_profile,g_auto,q_auto/v1/filestore/94gsn73a6aue8j0bv2qigfliaw72_1583915348_pawna_thumbnail.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Valvan Dam",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Tent_camping_along_the_Sulayr_trail_in_La_Taha%2C_Sierra_Nevada_National_Park_%28DSCF5147%29.jpg/1200px-Tent_camping_along_the_Sulayr_trail_in_La_Taha%2C_Sierra_Nevada_National_Park_%28DSCF5147%29.jpg",
        description: "Its great!! visit. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Pawna Lake",
        image: "https://in.bmscdn.com/nmcms/events/banner/desktop/media-desktop-pawna-lake-camping-2020-10-7-t-12-32-31.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }
    ];

// function seedDB(){
    // REMOVE ALL CAMPGROUNDS
    // Post.deleteMany({}, function(err){
    // if(err){
    //     console.log(err);
    // } 
    //     console.log("removed campgrounds!");
    //      // ADD FEW CAMPGROUNDS
    //     data.forEach(function(seed){
    //     Campground.create(seed,function(err, campground){
    //         if(err){
    //         console.log(err);
    //         } else {
    //             console.log("added a campground");
    //              // create a comment
    //              Comment.create(
    //                  {
    //                      text: "This place is great, but i wish there was internet",
    //                      author: "Homer"
    //                  }, function(err, comment){
    //                      if(err){
    //                          console.log(err);
    //                      } else{
    //                          campground.comments.push(comment);
    //                          campground.save();
    //                          console.log("created new comment");
    //                      }
    //                  });
    //         } 
    //     });
    // });
// });
// }
// module.exports = seedDB;
