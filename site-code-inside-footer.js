    var open_prototype = XMLHttpRequest.prototype.open,
    intercept_response = function(urlpattern, replacerCallback) {
       XMLHttpRequest.prototype.open = function() {
          arguments['1'].match(urlpattern) && this.addEventListener('readystatechange', function(event) {
            const readyState = this.readyState;
            if (readyState === 4) {
                var response = replacerCallback (event.target.responseText);
                Object.defineProperty(this, 'response',     {writable: true});
                Object.defineProperty(this, 'responseText', {writable: true});
                this.response = this.responseText = response;
            }
          });
          return open_prototype.apply(this, arguments);
       }
    };
    intercept_response(/integrations/i, function(response) {
        const json = JSON.parse(response);
        var records = json.records;
        if (!records) {
            nodesWithTemplates.forEach(function(nodeInfo) {
               const node = nodeInfo.node;
               node.textContent = node.textContent.replace(/{{(.*?)}}/g, function(a, b) {
                    return json.fields[b];
               });
               node.parentElement.style.visibility = nodeInfo.visibility;
            })
            records = [json];
        }
        // For each record, for each field, if the field's value contains {fieldName},
        // replace {fieldName} with the value of that field in that record.
        records.forEach(function (record) {
            for (const prop in record.fields) {
                record.fields[prop] = record.fields[prop].replace(/{{(.*?)}}/g, function(a, b) {
                    return record.fields[b];
                });
            }
        });
        return JSON.stringify(json);
    });