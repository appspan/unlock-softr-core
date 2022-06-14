<script>
var nodesWithTemplates = [];
const observer = new MutationObserver(function(mutations_list) {
	mutations_list.forEach(function(mutation) {
		mutation.addedNodes.forEach(function(added_node) {
		    if (added_node.nodeName === "#text" && added_node.textContent.includes("{{")) {
    	        nodesWithTemplates.push({node: added_node, visibility: added_node.parentElement.style.visibility});
    	        added_node.parentElement.style.visibility = "hidden";
	        }
		});
	});
});
observer.observe(document.querySelector("html"), { subtree: true, childList: true });
</script>
