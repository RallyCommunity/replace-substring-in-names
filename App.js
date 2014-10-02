Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:{ html:'<a href="https://help.rallydev.com/apps/2.0rc3/doc/">App SDK 2.0rc3 Docs</a>'},
    launch: function() {
        this._oldString = 'publo';
        this._newString = 'van eyck';
        var stories = Ext.create('Rally.data.wsapi.Store', {
            model: 'UserStory',
            fetch: ['Name','FormattedID', 'ObjectID'],
            filters:[
                {
                    property: 'Name',
                    operator: 'contains',
                    value: this._oldString
                }
            ]
        });
        stories.load().then({
            success: this.updateStories,
            scope: this
            }).then({
            success: this.showUpdated,
            scope: this
            }).then({
                success: function() {
                    console.log('success!');
                },
                failure: function(error) {
                    console.log("oh noes!");
                }
        });
    },
    updateStories:function(data){
        var that = this;      
        if (data.length == 0) {
            console.log('no records found');
            return false;
        }
        var promises = [];
       _.each(data, function(record){
            var name = record.get('Name');
            var fid = record.get('FormattedID');
            console.log(fid, name);
            record.set('Name', name.replace(that._oldString, that._newString));
            record.save();
            promises.push(record);
        })

        return Deft.Promise.all(promises);
    },
    showUpdated:function(records){
        console.log('stories after update');
         _.each(records, function(record){
            console.log(record.get('FormattedID') + ' ' + record.get('Name'));
        });
    }
});
