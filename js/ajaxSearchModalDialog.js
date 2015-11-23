/**
 * Created by davidteruel on 23/11/15.
 */
$(document).ready(function () {

    var jsonPlates = null;

    //moda initialization. Delete all previous elements that exists.
    $("button.display-modal").click(function (event) {

        $("ul#category-filters-selected").find('li').remove();
        $("#search-plate").val('');
        $("#result-plates").find('p').remove();
        $("#result-plates").find('a').remove();
        $("#selected-plate-description").addClass("hide");
    });


    //Get the filter selected of dropdown list and put it into a <UL> as a selected filter
    $(document).on("click", "ul.dropdown-menu.category-list li a", function (event) {

        event.preventDefault();

        var selectedFiltersList = $("ul#category-filters-selected");

        var liCategoryId = $(this).attr("data-elem");

        var labelFilter = '<li><a href="#" class="label label-primary" data-elem="'+liCategoryId+'">' + $(this).html() + '</a></li>';

        $(selectedFiltersList).html($(selectedFiltersList).html() + labelFilter);

        $(this).parent().remove();
    });


    //Remove the filter of <UL> and put it into de dropdown list in the first position (this listener uses the event delegation to be created dinamically)
    $(document).on("click", "ul#category-filters-selected li a", function (event) {
        event.preventDefault();

        var filterList = $("ul.dropdown-menu.category-list");

        var liCategoryId = $(this).attr("data-elem");

        var labelFilter = '<li id="elem-categoria-'+liCategoryId+'"><a href="#" data-elem="'+liCategoryId+'">'+$(this).html()+'</a></li>';

        var listContent = $(filterList).html();
        $(filterList).find('li').remove();
        $(filterList).append(labelFilter);
        $(filterList).append(listContent);

        $(this).parent().remove();
    });

    //Search button action
    $("#button-search-plates").click(function () {

        if($("#search-plate").val().length < 3){
            alert("You must write at least 3 characters...");

            return;
        }

        //Read the selected filters and put into an array
        var listIdCategoriesFilter = [];
        $("ul#category-filters-selected li a").each(function () {
            listIdCategoriesFilter.push(parseInt($(this).attr('data-elem')));
        });

        if(listIdCategoriesFilter.length == 0){ //No filters selected, put all categories to search
            listIdCategoriesFilter = [1, 2, 3, 4];
        }

        var urlAjaxSearch = "plates.json";
        $.getJSON(urlAjaxSearch, function(data){

            jsonPlates = data;

            //Clean all previous results and put newest into the results block
            $(".results").addClass("hide");
            $("#result-plates").find('a').remove();
            $("#selected-plate-description").addClass("hide");

            var results = 0;
            $.each(data, function (index, plate) {

                if(listIdCategoriesFilter.indexOf(plate.category) != -1 && plate.name.toLowerCase().indexOf($("#search-plate").val().toLowerCase()) != -1){
                    var row = '<a href="#" class="list-group-item" data-position-json="'+ index +'">' + plate.name + '</a>';
                    $("#result-plates").append(row);
                    results += 1;
                }
            });

            $(".results").html(results + " results").removeClass("hide");
        });
    });

    //Blocks the top navigation of link and put the active class to the selected plate
    $(document).on("click", "div#result-plates a.list-group-item", function (event) {
        event.preventDefault();

        //Remove the previous plate selected
        $("div#result-plates a.list-group-item.active").each(function () {
            $(this).removeClass("active");
        });

        $(this).addClass("active");

        //Shows plate information
        $("#selected-plate-description").removeClass("hide");
        $("h3.plate-title").html("<strong>" + $(this).html() + "</strong>");

        var platoInfo = jsonPlates[$(this).attr("data-position-json")];

        $("div.plate-description").html(
            "<p><strong>Commensal:</strong> "+platoInfo.commensal+"</p>" +
            "<p><strong>Price:</strong> "+platoInfo.price+"</p>" +
            "<p><strong>Dificulty:</strong> "+platoInfo.level+"/5</p>" +
            "<p><strong>Duration:</strong> "+platoInfo.duration+" min.</p>" +
            "<p><strong>Energy:</strong> "+platoInfo.energy+" Kcal</p>" +
            "<p><strong>Fiber:</strong> "+platoInfo.fiber+" gr.</p>" +
            "<p><strong>Fats:</strong> "+platoInfo.total_fat+" gr.</p>" +
            "<p><strong>Proteins:</strong> "+platoInfo.proteins+" gr.</p>" +
            "<p><strong>Size:</strong> "+platoInfo.size+"</p>" +
            "<p><strong>Recipe:</strong> "+platoInfo.recipe+"</p>"
        );
    });

    $(".display-modal").click(function () {
        var targetInput = $(this).attr("data-input-id");

        $(".selected-plate-button").attr("data-target-input", targetInput);
    });

    //Writes the selected plate into the target input element
    $(".selected-plate-button").click(function () {
        var plateSelected = $("div#result-plates a.list-group-item.active").html();
        var targetInput = $(this).attr("data-target-input");

        $("#" + targetInput).val(plateSelected);

        $('#myModal').modal('hide');
    });
});