// [{path : 'ex,ex' , files :[]}]

export default function list_to_tree(input) {
    var output = [];
    for (var i = 0; i < input.length; i++) {
        var chain = input[i].path.split(',');
        var currentNode = output;
        for (var j = 0; j < chain.length; j++) {
            var wantedNode = chain[j];
            var lastNode = currentNode;
            for (var k = 0; k < currentNode.length; k++) {
                if (currentNode[k].name == wantedNode) {
                    currentNode = currentNode[k].children;
                    break;
                }
            }

            if (lastNode == currentNode) {
                var newNode = (currentNode[k] = {
                    name: wantedNode,
                    children: [],
                    files: input[i].reports,
                    path: input[i].path,
                });
                currentNode = newNode.children;
            }
        }
    }
    return output;
}
