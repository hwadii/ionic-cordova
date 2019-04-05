// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.factory('Projects', function() {
  return {
    all: function() {
      var projectString = window.localStorage['projects'];
      if(projectString) {
        return angular.fromJson(projectString);
      }
      return [];
    },
    save: function(projects) {
      window.localStorage['projects'] = angular.toJson(projects);
    },
    newProject: function(projectTitle) {
      // Add a new project
      return {
        title: projectTitle,
        tasks: []
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveProject']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
    }
  }
})

.controller('mainController', function($scope, $http, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate) {

    this.http.get('localhost:3000/getTaskSet')
      .map(res => res.json())
      .subscribe(data => {
        this.data = data;
//        resolve(this.data);
        console.log(this.data);
      });

    // $http.get('localhost:3000/getTaskSet')
    //     .success(function(data) {
    //         $scope.laliste = data;
    //     })
    //     .error(function(data) {
    //         console.log('Error: ' + data);
    //     });


    var createProject = function(projectTitle) {
      var newProject = Projects.newProject(projectTitle);
      $scope.projects.push(newProject);
      Projects.save($scope.projects);
      $scope.selectProject(newProject, $scope.projects.length-1);
    }

    // Load or initialize projects
    $scope.projects = Projects.all();

    // Grab the last active, or the first project
    $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];


    // Called to create a new project
    $scope.newProject = function() {
      var projectTitle = prompt('Project name');
      if(projectTitle) {
        createProject(projectTitle);
      }
    };

    // Called to select the given project
    $scope.selectProject = function(project, index) {
      $scope.activeProject = project;
      Projects.setLastActiveIndex(index);
      $ionicSideMenuDelegate.toggleLeft(false);
    };


    // Create our modal
    $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
      $scope.taskModal = modal;
    }, {
      scope: $scope
    });

    //   // No need for testing data anymore
    // $scope.tasks = [];

    // // Create and load the Modal
    // $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    //   $scope.taskModal = modal;
    // }, {
    //   scope: $scope,
    //   animation: 'slide-in-up'
    // });

    
    $scope.createTask = function(task) {
      if(!$scope.activeProject || !task) {
        return;
      }
      $scope.activeProject.tasks.push({
        name: task.name
      });
      $scope.taskModal.hide();

      // Inefficient, but save all the projects
      Projects.save($scope.projects);

      task.name = "";
    };


    // Open our new task modal
    $scope.newTask = function() {
      $scope.taskModal.show();
    };

    // Close the new task modal
    $scope.closeNewTask = function() {
      $scope.taskModal.hide();
    };


    $scope.toggleProjects = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };


    $timeout(function() {
      if($scope.projects.length == 0) {
        while(true) {
          var projectTitle = prompt('Your first project title:');
          if(projectTitle) {
            createProject(projectTitle);
            break;
          }
        }
      }
    }, 1000);
})
// .run(function($ionicPlatform) {
//   $ionicPlatform.ready(function() {
//     // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//     // for form inputs).
//     // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
//     // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
//     // useful especially with forms, though we would prefer giving the user a little more room
//     // to interact with the app.
//     if (window.cordova && window.Keyboard) {
//       window.Keyboard.hideKeyboardAccessoryBar(true);
//     }

//     if (window.StatusBar) {
//       // Set the statusbar to use the default style, tweak this to
//       // remove the status bar on iOS or change it to use white instead of dark colors.
//       StatusBar.styleDefault();
//     }
//   });
// })
