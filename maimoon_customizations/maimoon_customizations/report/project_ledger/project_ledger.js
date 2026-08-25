// Copyright (c) 2026, Samtech Solutions and contributors
// For license information, please see license.txt

frappe.query_reports["Project Ledger"] = {
	filters: [
		{
			fieldname: "company",
			label: __("Company"),
			fieldtype: "Link",
			options: "Company",
			default: frappe.defaults.get_user_default("Company"),
			reqd: 1,
		},
		{
			fieldname: "from_date",
			label: __("From Date"),
			fieldtype: "Date",
			default: frappe.datetime.add_months(frappe.datetime.get_today(), -1),
			reqd: 1,
			width: "60px",
		},
		{
			fieldname: "to_date",
			label: __("To Date"),
			fieldtype: "Date",
			default: frappe.datetime.get_today(),
			reqd: 1,
			width: "60px",
		},
		{
			fieldname: "account",
			label: __("Account"),
			fieldtype: "MultiSelectList",
			options: "Account",
			get_data: function (txt) {
				return frappe.db.get_link_options("Account", txt, {
					company: frappe.query_report.get_filter_value("company"),
				});
			},
		},
		{
			fieldtype: "Break",
		},
		{
			fieldname: "party_type",
			label: __("Party Type"),
			fieldtype: "Autocomplete",
			options: Object.keys(frappe.boot.party_account_types),
			on_change: function () {
				frappe.query_report.set_filter_value("party", []);
			},
			hidden: 1,
		},
		{
			fieldname: "party",
			label: __("Party"),
			fieldtype: "MultiSelectList",
			options: "party_type",
			get_data: function (txt) {
				if (!frappe.query_report.filters) return;

				let party_type = frappe.query_report.get_filter_value("party_type");
				if (!party_type) return;

				return frappe.db.get_link_options(party_type, txt);
			},
			on_change: function () {
				var party_type = frappe.query_report.get_filter_value("party_type");
				var parties = frappe.query_report.get_filter_value("party");

				if (!party_type || parties.length === 0 || parties.length > 1) {
					frappe.query_report.set_filter_value("party_name", "");
					frappe.query_report.set_filter_value("tax_id", "");
					return;
				} else {
					var party = parties[0];
					var fieldname = erpnext.utils.get_party_name(party_type) || "name";
					frappe.db.get_value(party_type, party, fieldname, function (value) {
						frappe.query_report.set_filter_value("party_name", value[fieldname]);
					});

					if (party_type === "Customer" || party_type === "Supplier") {
						frappe.db.get_value(party_type, party, "tax_id", function (value) {
							frappe.query_report.set_filter_value("tax_id", value["tax_id"]);
						});
					}
				}
			},
			hidden: 1,
		},
		{
			fieldname: "party_name",
			label: __("Party Name"),
			fieldtype: "Data",
			hidden: 1,
		},
		// {
		// 	fieldname: "categorize_by",
		// 	label: __("Categorize by"),
		// 	fieldtype: "Select",
		// 	options: [
		// 		"",
		// 		{
		// 			label: __("Categorize by Voucher"),
		// 			value: "Categorize by Voucher",
		// 		},
		// 		{
		// 			label: __("Categorize by Voucher (Consolidated)"),
		// 			value: "Categorize by Voucher (Consolidated)",
		// 		},
		// 		{
		// 			label: __("Categorize by Account"),
		// 			value: "Categorize by Account",
		// 		},
		// 		{
		// 			label: __("Categorize by Party"),
		// 			value: "Categorize by Party",
		// 		},
		// 	],
		// 	default: "Categorize by Voucher (Consolidated)",
		// 	hidden: 1,
		// },
		{
			fieldname: "tax_id",
			label: __("Tax Id"),
			fieldtype: "Data",
			hidden: 1,
		},
		{
			fieldname: "presentation_currency",
			label: __("Currency"),
			fieldtype: "Select",
			options: erpnext.get_presentation_currency_list(),
		},
		{
			fieldname: "cost_center",
			label: __("Cost Center"),
			fieldtype: "MultiSelectList",
			options: "Cost Center",
			get_data: function (txt) {
				return frappe.db.get_link_options("Cost Center", txt, {
					company: frappe.query_report.get_filter_value("company"),
				});
			},
		},
		{
			fieldname: "project",
			label: __("Project"),
			fieldtype: "MultiSelectList",
			options: "Project",
			get_data: function (txt) {
				return frappe.db.get_link_options("Project", txt, {
					company: frappe.query_report.get_filter_value("company"),
				});
			},
			reqd: 1,
		},
		{
			fieldname: "show_opening_entries",
			label: __("Show Opening Entries"),
			fieldtype: "Check",
		},
		{
			fieldname: "add_values_in_transaction_currency",
			label: __("Add Columns in Transaction Currency"),
			fieldtype: "Check",
		},
		{
			fieldname: "show_remarks",
			label: __("Show Remarks"),
			fieldtype: "Check",
		},
	],
};

erpnext.utils.add_dimensions("General Ledger", 15);
