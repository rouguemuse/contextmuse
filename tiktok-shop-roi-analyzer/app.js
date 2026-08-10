// Presets for the Profit & Risk Analyzer
const templates = {
    beauty: {
        name: "Viral Glass Skin Kit",
        price: 29.99,
        cogs: 6.50,
        shipping: 4.99,
        commission: 15,
        category: "beauty",
        isSafe: true,
        tag: "Beginner Friendly"
    },
    scrubber: {
        name: "Electric Spin Scrubber",
        price: 39.99,
        cogs: 11.20,
        shipping: 5.50,
        commission: 20,
        category: "home",
        isSafe: true,
        tag: "High Volume"
    },
    vitamins: {
        name: "Liquid Morning Vitamin Drops",
        price: 24.99,
        cogs: 4.80,
        shipping: 4.25,
        commission: 20,
        category: "supplements",
        isSafe: false,
        tag: "Compliance Required"
    },
    weightloss: {
        name: "Keto Burn Wellness Gummy",
        price: 34.99,
        cogs: 5.20,
        shipping: 4.25,
        commission: 25,
        category: "weightloss",
        isSafe: false,
        tag: "High Risk Policy"
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // Inputs
    const productNameInput = document.getElementById("product-name");
    const categorySelect = document.getElementById("product-category");
    const sellingPriceInput = document.getElementById("selling-price");
    const sellingPriceSlider = document.getElementById("selling-price-slider");
    const cogsInput = document.getElementById("cogs");
    const cogsSlider = document.getElementById("cogs-slider");
    const shippingInput = document.getElementById("shipping");
    const shippingSlider = document.getElementById("shipping-slider");
    const commissionInput = document.getElementById("commission");
    const commissionSlider = document.getElementById("commission-slider");
    
    // Fee Inputs
    const platformFeeInput = document.getElementById("platform-fee");
    const btnFee6 = document.getElementById("btn-fee-6");
    const btnFee8 = document.getElementById("btn-fee-8");

    // Sourcing / Fulfillment Checklist Toggle Inputs
    const toggleDomestic = document.getElementById("toggle-domestic");
    const dispatchTimeInput = document.getElementById("dispatch-time");
    const toggleTracking = document.getElementById("toggle-tracking");
    const toggleReturns = document.getElementById("toggle-returns");

    // Creator Economics & Budget Inputs
    const sampleCostInput = document.getElementById("sample-cost");
    const sampleQtyInput = document.getElementById("sample-qty");
    const returnRateInput = document.getElementById("return-rate");
    const adSpendInput = document.getElementById("ad-spend");
    const projectedSalesInput = document.getElementById("projected-sales");

    // Score Panel Outputs
    const scoreProductVal = document.getElementById("score-product-val");
    const scoreFulfillmentVal = document.getElementById("score-fulfillment-val");

    // Economics Panel Outputs
    const econGrossMargin = document.getElementById("econ-gross-margin");
    const econPlatformFee = document.getElementById("econ-platform-fee");
    const econCommission = document.getElementById("econ-commission");
    const econRefundCost = document.getElementById("econ-refund-cost");
    const econSampleCost = document.getElementById("econ-sample-cost");
    const econAdCost = document.getElementById("econ-ad-cost");
    const econTotalCost = document.getElementById("econ-total-cost");
    const econNetProfit = document.getElementById("econ-net-profit");
    const econNetMargin = document.getElementById("econ-net-margin");
    const econRoi = document.getElementById("econ-roi");
    const econBreakevenRoas = document.getElementById("econ-breakeven-roas");

    // Verdict Elements
    const verdictCard = document.getElementById("verdict-card");
    const verdictBadge = document.getElementById("verdict-badge");
    const verdictExplanation = document.getElementById("verdict-explanation");

    // Compliance Alert Banner
    const complianceAlert = document.getElementById("compliance-alert");
    const complianceAlertTitle = document.getElementById("compliance-alert-title");
    const complianceAlertText = document.getElementById("compliance-alert-text");

    // Preset Buttons
    const presetBtns = document.querySelectorAll(".preset-btn");

    // Slider Binders
    function bindSliderInput(slider, input, suffix = "", prefix = "") {
        slider.addEventListener("input", (e) => {
            input.value = parseFloat(e.target.value).toFixed(2);
            calculateAnalyzer();
        });
        input.addEventListener("input", (e) => {
            let val = parseFloat(e.target.value) || 0;
            slider.value = val;
            calculateAnalyzer();
        });
    }

    bindSliderInput(sellingPriceSlider, sellingPriceInput);
    bindSliderInput(cogsSlider, cogsInput);
    bindSliderInput(shippingSlider, shippingInput);
    bindSliderInput(commissionSlider, commissionInput);

    // Platform Fee Button Toggle Logic
    btnFee6.addEventListener("click", () => {
        platformFeeInput.value = "6.00";
        btnFee6.classList.add("active");
        btnFee8.classList.remove("active");
        calculateAnalyzer();
    });

    btnFee8.addEventListener("click", () => {
        platformFeeInput.value = "8.00";
        btnFee8.classList.add("active");
        btnFee6.classList.remove("active");
        calculateAnalyzer();
    });

    platformFeeInput.addEventListener("input", () => {
        btnFee6.classList.remove("active");
        btnFee8.classList.remove("active");
        calculateAnalyzer();
    });

    // Preset buttons binding
    presetBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            presetBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const type = btn.getAttribute("data-preset");
            if (templates[type]) {
                const item = templates[type];
                productNameInput.value = item.name;
                sellingPriceInput.value = item.price.toFixed(2);
                sellingPriceSlider.value = item.price;
                cogsInput.value = item.cogs.toFixed(2);
                cogsSlider.value = item.cogs;
                shippingInput.value = item.shipping.toFixed(2);
                shippingSlider.value = item.shipping;
                commissionInput.value = item.commission;
                commissionSlider.value = item.commission;
                categorySelect.value = item.category;

                // Adjust default sample cost based on item sourcing cost
                sampleCostInput.value = (item.cogs + item.shipping).toFixed(2);

                calculateAnalyzer();
            }
        });
    });

    // Re-trigger calculation on any inputs
    const allFormInputs = [
        categorySelect, toggleDomestic, dispatchTimeInput, toggleTracking,
        toggleReturns, sampleCostInput, sampleQtyInput, returnRateInput,
        adSpendInput, projectedSalesInput
    ];
    allFormInputs.forEach(input => input.addEventListener("change", calculateAnalyzer));
    allFormInputs.forEach(input => input.addEventListener("input", calculateAnalyzer));

    function calculateAnalyzer() {
        const price = parseFloat(sellingPriceInput.value) || 0;
        const cogs = parseFloat(cogsInput.value) || 0;
        const shipping = parseFloat(shippingInput.value) || 0;
        const commissionPct = parseFloat(commissionInput.value) || 0;
        const platformFeePct = parseFloat(platformFeeInput.value) || 0;
        const category = categorySelect.value;

        // Creator Economics Inputs
        const sampleCost = parseFloat(sampleCostInput.value) || 0;
        const sampleQty = parseInt(sampleQtyInput.value) || 0;
        const returnRatePct = parseFloat(returnRateInput.value) || 0;
        const adSpend = parseFloat(adSpendInput.value) || 0;
        const projectedSales = Math.max(1, parseInt(projectedSalesInput.value) || 100);

        // Core Economics Formulas
        const grossMargin = price - cogs;
        const platformFee = price * (platformFeePct / 100);
        const commissionFee = price * (commissionPct / 100);
        
        // Administrative Refund/Return Fee estimate (Return handling, return shipping, damaged goods)
        // Average returned order loses shipping cost + platform fee + a small reprocessing fee (e.g. $2)
        const returnRate = returnRatePct / 100;
        const refundCostPerUnit = returnRate * (shipping + platformFee + 2.50);

        // Amortized Sample and Ad/Content overhead
        const totalSampleExpense = sampleCost * sampleQty;
        const amortizedPromoExpense = (totalSampleExpense + adSpend) / projectedSales;

        // Total Cost & Net Profit
        const totalUnitCost = cogs + shipping + platformFee + commissionFee + refundCostPerUnit + amortizedPromoExpense;
        const netProfit = price - totalUnitCost;
        const netMarginPct = price > 0 ? (netProfit / price) * 100 : 0;
        const roiPct = (cogs + shipping) > 0 ? (netProfit / (cogs + shipping)) * 100 : 0;
        const breakevenRoas = netProfit > 0 ? price / netProfit : 0;

        // 1. PRODUCT RISK RATING
        let productRisk = "Green";
        let complianceMsg = "";
        let complianceTitle = "";

        if (category === "supplements" || category === "weightloss" || category === "wellness") {
            productRisk = "Red";
            complianceTitle = "⚠️ Compliance Restriction Alert";
            complianceMsg = "Supplements, wellness formulas, and weight-loss claims are highly regulated on TikTok. Direct certifications, lab testing records, and strict claim monitoring are required. NOT beginner-safe.";
        } else if (category === "baby" || category === "regulated") {
            productRisk = "Yellow";
            complianceTitle = "⚡ Regulatory Requirements Alert";
            complianceMsg = "Baby products and child safety goods require CPC (Children's Product Certificate) licensing. Regulated electronics must pass FCC compliance.";
        } else if (price < 12) {
            productRisk = "Yellow";
            complianceTitle = "💸 Thin Price Risk";
            complianceMsg = "Items under $12 struggle on TikTok Shop because fixed processing costs, shipping, and creator commissions leave almost zero net profitability.";
        } else if (price > 90) {
            productRisk = "Yellow";
            complianceTitle = "📦 High-Ticket Risk";
            complianceMsg = "High-ticket items (> $90) face high chargeback rates, manual buyer friction, and require exceptional influencer trust to sell.";
        }

        // Show/Hide Compliance Banner
        if (productRisk !== "Green") {
            complianceAlert.className = "risk-alert-panel active";
            complianceAlertTitle.innerText = complianceTitle;
            complianceAlertText.innerText = complianceMsg;
        } else {
            complianceAlert.className = "risk-alert-panel";
        }

        // Update Product Risk UI
        scoreProductVal.innerText = productRisk;
        scoreProductVal.className = "score-num " + productRisk.toLowerCase();

        // 2. FULFILLMENT RISK SCORE (0 to 100 Scale)
        let fulfillmentScore = 0;
        const isDomestic = toggleDomestic.checked;
        const dispatchDays = parseInt(dispatchTimeInput.value) || 3;
        const hasTracking = toggleTracking.checked;
        const hasReturns = toggleReturns.checked;

        if (isDomestic) fulfillmentScore += 35;
        if (dispatchDays <= 1) fulfillmentScore += 30;
        else if (dispatchDays === 2) fulfillmentScore += 20;
        else if (dispatchDays === 3) fulfillmentScore += 5;
        
        if (hasTracking) fulfillmentScore += 20;
        if (hasReturns) fulfillmentScore += 15;

        // Apply penalties
        if (!isDomestic && dispatchDays > 2) {
            fulfillmentScore = Math.max(0, fulfillmentScore - 20); // Penalty for international slow dispatch
        }

        // Display Score
        scoreFulfillmentVal.innerText = fulfillmentScore + "/100";
        if (fulfillmentScore >= 80) {
            scoreFulfillmentVal.className = "score-num green";
        } else if (fulfillmentScore >= 50) {
            scoreFulfillmentVal.className = "score-num yellow";
        } else {
            scoreFulfillmentVal.className = "score-num red";
        }

        // 3. UPDATE ECONOMICS UI
        econGrossMargin.innerText = `$${grossMargin.toFixed(2)}`;
        econPlatformFee.innerText = `$${platformFee.toFixed(2)}`;
        econCommission.innerText = `$${commissionFee.toFixed(2)}`;
        econRefundCost.innerText = `$${refundCostPerUnit.toFixed(2)}`;
        econSampleCost.innerText = `$${(totalSampleExpense / projectedSales).toFixed(2)}`;
        econAdCost.innerText = `$${(adSpend / projectedSales).toFixed(2)}`;
        econTotalCost.innerText = `$${totalUnitCost.toFixed(2)}`;
        econNetProfit.innerText = `$${netProfit.toFixed(2)}`;
        econNetMargin.innerText = `${netMarginPct.toFixed(1)}%`;
        econRoi.innerText = `${roiPct.toFixed(1)}%`;
        econBreakevenRoas.innerText = netProfit > 0 ? `${breakevenRoas.toFixed(2)}x` : "N/A";

        // Net profit text coloring
        econNetProfit.className = "econ-val " + (netProfit >= 0 ? "positive" : "negative");
        econNetMargin.className = "econ-val " + (netProfit >= 0 ? "positive" : "negative");

        // 4. VERDICT DECISION ENGINE
        let verdict = "WATCH";
        let colorClass = "verdict-watch";
        let reason = "The metrics are moderate. Check your product pricing and supplier delivery speed to improve metrics before testing.";

        if (netProfit < 0 || netMarginPct < 5) {
            verdict = "WALK AWAY";
            colorClass = "verdict-walk";
            reason = "Negative net margins detected. High affiliate commissions, returns, or product costs make this item unprofitable. Abandon this test.";
        } else if (productRisk === "Red") {
            verdict = "WALK AWAY";
            colorClass = "verdict-walk";
            reason = "Regulated medical, wellness, or supplement claims carry extreme account suspension risks. Walk away unless you possess verified certifications.";
        } else if (fulfillmentScore < 50) {
            verdict = "SOURCE DIFFERENTLY";
            colorClass = "verdict-source";
            reason = "Your margin is viable, but the logistics pipeline is dangerously slow. Switch to a reliable US domestic supplier to prevent shipping strikes.";
        } else if (netMarginPct < 20) {
            verdict = "FIX PRICING";
            colorClass = "verdict-fix";
            reason = "Healthy cash flow exists, but the margins are too thin to absorb standard TikTok returns and creator seeding. Raise the retail price or lower product costs.";
        } else if (netMarginPct >= 20 && fulfillmentScore >= 80 && productRisk === "Green") {
            verdict = "TEST IMMEDIATELY";
            colorClass = "verdict-test";
            reason = "Excellent margin profiles, low regulatory friction, and robust logistical setups. Order your samples and begin seeding micro-influencers immediately!";
        }

        // Apply Verdict styling
        verdictCard.className = "card verdict-card " + colorClass;
        verdictBadge.innerText = verdict;
        verdictExplanation.innerText = reason;
    }

    // Default to first preset
    presetBtns[0].click();
});
