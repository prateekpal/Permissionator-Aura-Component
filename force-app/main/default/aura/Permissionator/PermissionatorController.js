({
    doInit : function(component,event,helper) {
   
        var action1 =component.get("c.getAllProfiles");
        action1.setCallback(this ,function(response){
            var state = response.getState();
            if( state=== "SUCCESS"){
                var data1=response.getReturnValue();
                component.set("v.profiles",data1);                
            }                      
        });               
        $A.enqueueAction(action1);
        
    },

    populateObjects : function(component,event,helper){
        
        var selectedProfile = component.find('reqprofile').get('v.value');
        if(selectedProfile=="None"){
            selectedProfile = '';
        }
        var resetList = [];
        component.set('v.objects',resetList);
        component.set('v.fields',resetList);
        component.set('v.selectedFields',resetList);
        
        
        var getProfileId = component.get("c.getProfileId");
        getProfileId.setParams({profilename : selectedProfile});
        getProfileId.setCallback(this ,function(response){
            var state = response.getState();
            var profId =response.getReturnValue();
            component.set("v.profileId", profId);
            helper.getObjectsHelper(component, event,helper, profId);
           console.log(component.get("v.profileId"))
        });
        $A.enqueueAction(getProfileId);
    },
    
    onObjectsChange : function(component,event,helper){
        console.log('In fields');
      //  var selectedProfile = component.find('reqprofile').get('v.value');

        var getProfileId = component.get("v.profileId");
        //getProfileId.setParams({profilename : selectedProfile});
        //getProfileId.setCallback(this ,function(response){
           // var state = response.getState();
            //var profId =response.getReturnValue();
            //console.log(profId); 
       // });
        helper.getAllFieldsHelper(component, event,helper,getProfileId);

        // $A.enqueueAction(getProfileId);
       
    },
    
    handleSaveClick: function (component, event,helper) {
        // Get the list of the "value" attribute on all the selected options
        
        var selectedProfile = component.find('reqprofile').get('v.value');
        var getProfileId = component.get("v.profileId");
        var selectedObject = component.find('reqobjects').get('v.value');
        var selectedOptionsList = component.find('selectOptions').get('v.value');
        var selectedRadioButton = component.find('radioGroup').get('v.value');
        console.log(selectedProfile +getProfileId+ selectedObject + selectedOptionsList + selectedRadioButton); 

        //var selectedOptionsList = event.getParam("value");
        //component.set("v.selectedFields" , selectedOptionsList);

        //var getProfileId = component.get("c.getProfileId");
        //getProfileId.setParams({profilename : selectedProfile});
        //getProfileId.setCallback(this ,function(response){
        //    var state = response.getState();
         //   var profId =response.getReturnValue();
          //  console.log(profId); 
        helper.helperMethod(component, event,helper,getProfileId,selectedObject,selectedOptionsList, selectedRadioButton);
      //  });
         
        // $A.enqueueAction(getProfileId);
      // alert("Options selected: '" + selectedOptionsList + "'");
      
    },
    
    radioChange : function(component,event,helper){
        var buttonOption = component.find('radioGroup').get('v.value');
        var buttonVarient;
        if(buttonOption === "option3" ){
            buttonVarient = "destructive";
        }else if(buttonOption === "option2" || buttonOption === "option1" ){
            buttonVarient = "brand";
        }
        console.log(buttonVarient);

        component.find('button').set("v.variant", buttonVarient);
        
    }

})