module.exports = function (sequelize, DataTypes) {

  var mainModel = {

      name: "mainModel", //must to define the name
      //custom queries
      execQuery: function (query, type) {
          var typeOfQuery = sequelize.QueryTypes.RAW;
          if (type != undefined) {
              typeOfQuery = sequelize.QueryTypes[type];
          }

          return sequelize.query(query, {
              type: typeOfQuery
          })
      },

      // delete Query
      deleteData: function (tableName, whereCondition) {
          var query = "delete from " + tableName + " where " + whereCondition;
          return this.execQuery(query, "DELETE");
      },

      //select All Data - where condition should by "" for all the data
      selectData: function (tableName, whereCondition) {
          var query = "select * from " + tableName;
          if (whereCondition != "") {
              query += " where " + whereCondition;
          }
          return this.execQuery(query, "SELECT");
      },

      //Insert a set of data with array
      insertData: function (tableName, data) {
          var query = "INSERT INTO " + tableName + " ";
          var k = "";
          var v = "";
          for (var key in data) {
              if (data.hasOwnProperty(key)) {
                  k = k + "" + key + "" + ",";
                  if (data[key] == null || data[key] == undefined) {
                      v = v + "NULL,";
                  } else if (data[key] == "now()") {
                      v = v + "now(),"
                  } else if (typeof data[key] != 'string') {
                      v = v + "'" + JSON.stringify(data[key]) + "',";
                  } else {
                      v = v + "'" + data[key] + "',";
                  }
                  //str.replace(/(^,)|(,$)/g, "")
              }

          }

          query = query + "(" + k.replace(/,+$/, "") + ") VALUES (" + v.replace(/,+$/g, "") + ");" + (data.hasOwnProperty('id') ? "" : "SELECT lastval();");
          return this.execQuery(query, "");
      },

      //Update a set of data
      updateData: function (tableName, data, whereCondition) {
          var query = "UPDATE " + tableName + " SET ";
          var updateFields = "";
          for (var key in data) {
              if (data.hasOwnProperty(key)) {
                  //k = k +""+key+""+",";
                  if (data[key] == null || data[key] == undefined) {
                      updateFields = updateFields + " " + key + "=NULL,";
                  } else if (data[key] == "now()") {
                      updateFields = updateFields + " " + key + "=now(),";
                      //v = v+"now(),"
                  } else if (typeof data[key] == 'string' && data[key].indexOf('array_cat(') > -1) {
                      updateFields = updateFields + " " + key + "=" + data[key] + ",";
                  } else if (typeof data[key] != 'string') {
                      updateFields = updateFields + " " + key + "='" + JSON.stringify(data[key]) + "',";
                      //v = v+"'"+JSON.stringify(data[key])+"',";
                  } else {
                      updateFields = updateFields + " " + key + "='" + data[key] + "',";
                      //v = v+"'"+data[key]+"',";
                  }
                  //str.replace(/(^,)|(,$)/g, "")
              }

          }

          query = query + updateFields.replace(/,+$/, "") + ((whereCondition !== '') ? " WHERE " + whereCondition : '') + ";";
          return this.execQuery(query, "");
      },
      upsertData: function (tableName, data, pkey) {
          var query = "INSERT INTO " + tableName + " ";
          var k = "";
          var v = "";
          var updateFields = "";
          for (var key in data) {
              if (data.hasOwnProperty(key)) {
                  k = k + "" + key + "" + ",";
                  if (data[key] == null || data[key] == undefined) {
                      v = v + "NULL,";
                      updateFields = updateFields + " " + key + "=NULL,";
                  } else if (data[key] == "now()") {
                      v = v + "now(),"
                      updateFields = updateFields + " " + key + "=now(),";
                  } else if (typeof data[key] != 'string') {
                      v = v + "'" + JSON.stringify(data[key]) + "',";
                      updateFields = updateFields + " " + key + "='" + JSON.stringify(data[key]) + "',";
                  } else {
                      v = v + "'" + data[key] + "',";
                      updateFields = updateFields + " " + key + "='" + data[key] + "',";
                  }
                  //str.replace(/(^,)|(,$)/g, "")
              }
          }
          query = query + "(" + k.replace(/,+$/, "") + ") VALUES (" + v.replace(/,+$/g, "") + ") ON CONFLICT ON CONSTRAINT " + pkey + ' DO UPDATE SET ' + updateFields.replace(/,+$/, "") + ';';
          return this.execQuery(query, "");
      },
      findTableRowDataById: function (tableName, id) {
          var query = "select * from " + tableName + " where id = " + id + " limit 1";
          return this.execQuery(query, "SELECT");
      },

      escapeFinTicker: function (ticker) {
          ticker = ticker.replace('amp;', '').replace(/-/g, '').replace(/\W/g, '').toLowerCase().trim();
          return ticker;
      },

      sortRes: function (data, type) {
          if (type == undefined) {
              type = 0
          }
          var updatedArr = [];
          for (var iL = 0; iL < data.length; iL++) {
              if (updatedArr[data[iL].id] == undefined) {
                  updatedArr.push(data[iL]);
              }
          }
          updatedArr.sort(function (a, b) {
              var key1 = a.created_at;
              var key2 = b.created_at;
              if (key1 > key2 && type == 0) {
                  return -1;
              } else if (key1 > key2 && type == 1) {
                  return -1;
              } else if (key1 == key2) {
                  return 0;
              } else {
                  return 1;
              }
          });
          return updatedArr;
      },
      //Increment a Column
      increment: function (tableName, column, whereCondition) {
          var query = "update " + tableName + " set " + column + "=" + column + "+1 where " + whereCondition + ";";
          return this.execQuery(query, "");
      },

      //Decrement a Column
      decrement: function (tableName, column, whereCondition) {
          var query = "update " + tableName + " set " + column + "=" + column + "-1 where " + whereCondition + ";";
          return this.execQuery(query, "");
      },

      count: function (tableName, column, whereCondition) {
          var query = "select count(" + column + ") as count from " + tableName + " where " + whereCondition + ";";
          return this.execQuery(query, "");
      },
      //Map Arr with key pair
      mapArr: function (arr, key) {
          var obj = {};
          if (arr.length != undefined) {
              for (var j = 0; j < arr.length; j++) {
                  obj[arr[j][key]] = arr[j];
              }
          }
          return obj;
      }

  };

  return mainModel;
};
