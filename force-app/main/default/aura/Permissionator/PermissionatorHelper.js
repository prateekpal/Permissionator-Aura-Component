({
	helperMethod : function(component, event,helper,profId,selectedObject,selectedOptionsList,selectedRadioButton) {
		
        var passSelectedFields = component.get("c.setFieldPermissions");   
        console.log('sadsd' + profId);  
        
        for(var i = 0; i<selectedOptionsList.length; i++){
            selectedOptionsList[i] = selectedObject + '.' + selectedOptionsList[i]
        }
        console.log(selectedOptionsList);
        passSelectedFields.setParams({selectedobj : selectedObject,
                                      listOfFields : selectedOptionsList,
                                      selectedProfId : profId,
                                      operation : selectedRadioButton});
        
        passSelectedFields.setCallback(this ,function(response){
            var state = response.getState();
            if( state === "SUCCESS" && response.getReturnValue() === true){
                component.find('button').set("v.variant", "success");
                component.find('button').set("v.label", "Success");

            }
            
            console.log('passSelectedFields' + state);   
        });
          $A.enqueueAction(passSelectedFields);
	},
    
    getObjectsHelper : function(component, event,helper,profId) {
        var action =component.get("c.getAllObjects");
        action.setParams({prof : profId});
        action.setCallback(this ,function(response){
            var state = response.getState();
            if( state=== "SUCCESS"){
                var data=response.getReturnValue();
                component.set("v.objects",data);
               console.log('***'+data); 
            }                      
        });
        $A.enqueueAction(action);

    },
    
    getAllFieldsHelper : function(component, event,helper,profId) {
        
        var action2 =component.get("c.getAllFields");
        var selobj = component.find('reqobjects').get('v.value');
        console.log('-->'+selobj);
        action2.setParams({selectedobj : selobj, selectedProfId : profId});
        action2.setCallback(this ,function(response){
            var state = response.getState();
            if( state=== "SUCCESS"){
                var data2=response.getReturnValue();
                console.log('fields'+ data2);
                var options = [];
                data2.forEach(function(selobj)  { 
                    options.push({ value: selobj, label: selobj});
                });

                component.set("v.fields",options);
                
            }else{
                console.log('No');
            }                      
        });
        $A.enqueueAction(action2);
	}
})