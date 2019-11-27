public class Dispallobjects {
    
    
    @AuraEnabled
    public static List<String> getAllObjects(String prof){
        List<String> allobj =new List<String>();
        List<AggregateResult> fps = [SELECT SObjectType sot ,Count(Parent.ProfileId) FROM FieldPermissions WHERE Parent.ProfileId =: prof GROUP BY SObjectType ORDER BY SObjectType ASC];
        /*for( Schema.SObjectType o: Schema.getGlobalDescribe().values()){
            //System.debug(o.getDescribe().getName());
            allobj.add(o.getDescribe().getLabel()); 
        }*/        

        for(AggregateResult fp : fps){
            String sot = (String)fp.get('sot'); 
            allobj.add(sot);
        }
        System.debug(allobj);
        return allobj;
        
    }
    
    @AuraEnabled
    public static List<String> getAllProfiles(){
        List<String> allprfl = new List<String>();

        for (Profile p :[select id,Name from profile]){
            allprfl.add(p.Name);
        }
        return allprfl;
    }
    
    @AuraEnabled
    public static String getProfileId(String profilename){
        List<sObject> profileNameId = [select Id from Profile where Profile.Name = :profilename ];
        String profileId = profileNameId[0].Id;
        return profileId;
    }
    
    @AuraEnabled
    public static List<String> getAllFields(String selectedobj , String selectedProfId){
        Set<String> allflds = new Set<String>();

        List<FieldPermissions> fp  = [SELECT Field FROM FieldPermissions WHERE SobjectType = :selectedobj  AND Parent.ProfileId = : selectedProfId];
        for(FieldPermissions fps : fp){
            
            allflds.add(fps.Field.substring(selectedobj.length() +1));
        }
        
        List<String> allfldslist = new List<String>(allflds);

        /* Map<String, Schema.SObjectField> objectFields = Schema.getGlobalDescribe().get(selectedobj).getDescribe().fields.getMap();
        allflds.addAll(objectFields.keySet());
        for(String str : allflds ){
            if(str.contains('__c')){
                allfldslist.add(str);
            }
        }*/
        return allfldslist;
    }
    
    
    @AuraEnabled
    public static boolean setFieldPermissions(String selectedobj, List<String> listOfFields, String selectedProfId, String operation){
        System.debug('mamama' + selectedobj);
        System.debug('dadadad' + listOfFields);
        System.debug('jajajaja' + selectedProfId);
        System.debug('hahahahah' + operation);

 		
       // String query = 'SELECT SobjectType, Field, PermissionsRead, PermissionsEdit, Parent.ProfileId FROM FieldPermissions WHERE SobjectType =:selectedobj  AND Parent.ProfileId IN (SELECT Id FROM PermissionSet WHERE PermissionSet.Profile.Name =:prof)';
      // String query = 'SELECT SobjectType, Field, PermissionsRead, PermissionsEdit, Parent.ProfileId FROM FieldPermissions '+ 
        //   ' WHERE SobjectType = :selectedobj  AND Parent.ProfileId = : selectedProfId AND Field IN : listOfFields' ;
        
      //  System.debug('papapapa' + Database.query(query));    

        List<FieldPermissions> fieldpermissions = [SELECT SobjectType, Field, PermissionsRead, PermissionsEdit, Parent.ProfileId FROM FieldPermissions 
                                                   WHERE SobjectType = :selectedobj  AND Parent.ProfileId = : selectedProfId AND Field IN : listOfFields];
        
        for(FieldPermissions fps : fieldpermissions){
            if(operation == 'option1'){
                fps.PermissionsEdit = true;
            }else if(operation == 'option2'){
                fps.PermissionsEdit = false;
            }else if(operation == 'option3'){
                fps.PermissionsRead = false;
                fps.PermissionsEdit = false;
            }
        }
        
        try{
            Database.update(fieldpermissions);            
        }catch(Exception ex){
            System.debug(ex);
            return false;
        }
       
        
        return true;
    }
    
}