frappe.after_ajax(function () {
	if (frappe.session.user === "Guest") return;
	setTimeout(() => build_company_switcher(), 500);
});

function build_company_switcher() {
	if (document.getElementById("navbar-company-switcher")) return;

	let current_company =
		(frappe.boot.user.defaults && frappe.boot.user.defaults.company) ||
		frappe.defaults.get_default("company") ||
		"";

	let $wrapper = $(`
        <li class="nav-item dropdown" id="navbar-company-switcher" style="list-style:none;">
            <select class="form-control form-control-sm"
                id="company-select-navbar"
                style="min-width:160px; margin-top:6px;">
            </select>
        </li>
    `);

	$(".navbar-nav").eq(1).prepend($wrapper);

	frappe.db.get_list("Company", { fields: ["name"], limit: 0 }).then((companies) => {
		let $select = $("#company-select-navbar");
		companies.forEach((c) => {
			$select.append(`<option value="${c.name}">${c.name}</option>`);
		});
		$select.val(current_company);

		$select.on("change", function () {
			let new_company = $(this).val();

			frappe.call({
				method: "company_switcher.api.set_company_default",
				args: { company: new_company },
				callback: function () {
					frappe.show_alert({
						message: __("Default company set to {0}", [new_company]),
						indicator: "green",
					});
					window.location.reload();
				},
			});
		});
	});
}
