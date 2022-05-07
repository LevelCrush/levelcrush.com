
document.addEventListener('DOMContentLoaded', function() {
    hookTableOfContents();
});


function clearExpandedTable() {
    var expanded = document.querySelectorAll('.table-of-contents li.expanded');
    for(var i = 0; i < expanded.length; i++) {
        expanded[i].classList.remove('expanded');
    }
}
function hookTableOfContents() {
    var toc = document.querySelectorAll('.table-of-contents');
    for(var i = 0; i < toc.length; i++) {
        var tableOfContents = toc[i];

        var listItems = tableOfContents.querySelectorAll('ol[data-level="1"] > li');
        var navAnchors  = tableOfContents.querySelectorAll('ol li a');
        var collapseToggles  = tableOfContents.querySelectorAll('button.collapse-toggle');
        for(var j = 0; j < listItems.length; j++) {
            var listItem = listItems[j];
            listItem.addEventListener('click', function(ev) {
                console.log("List Item Click");

                /***
                 * @type HTMLElement
                 */
                var element = ev.currentTarget;

                /***
                 * @type HTMLElement
                 */
                var targetElement = ev.target;

                if(ev.target === ev.currentTarget) {
                    if(element.classList.contains('expanded')) {
                        element.classList.remove('expanded');
                    } else {
                        clearExpandedTable();
                        element.classList.add('expanded');
                    }   
                }   
                

            });
        }
       for(var j = 0; j < collapseToggles.length;j++) {
            var toggl = collapseToggles[j];
            toggl.addEventListener('click', function(ev) {
                ev.preventDefault();
                if(ev.target.classList.contains('top-collapse')) {
                    ev.target.parentNode.parentNode.classList.toggle('expanded');
                } else {
                    ev.target.parentNode.click();
                }
                return false;
            }); 
       }
         for(var j = 0; j < navAnchors.length;j++) {
            var anchor = navAnchors[j];
            anchor.addEventListener('click', function(ev) {
              
                /**
                 * @type HTMLAnchorElement
                 */
                var element = ev.target;
                let hashbangSplit = element.href.split('#');
                let hashBang = hashbangSplit.length > 0 ? hashbangSplit[1].trim() : '';
                if(hashBang.trim().length > 0) {
                    ev.preventDefault();
                    console.log(  document.getElementById(hashBang));
                    document.getElementById(hashBang).scrollIntoView({
                        behavior: 'smooth'
                    });
                    if(element.parentNode.classList.contains('expanded') === false) {
                        element.parentNode.click();
                    }
                    return false;
                }
    
            });
        }
        
    }
}
