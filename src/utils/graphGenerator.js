import Graph from "../models/Graph.js";

const buildNodes = (capsule) => {
  const nodes = [];

  // ── identity ──
  // fields connect directly to Prasad node
  if (capsule.identity) {
    nodes.push({
      id: "identity_1",
      label: capsule.identity.name || "Identity",
      domain: "identity",
      data: { type: "root" },
    });

    if (capsule.identity.dob) {
      nodes.push({
        id: "identity_dob",
        label: `DOB: ${new Date(capsule.identity.dob).toLocaleDateString()}`,
        domain: "identity",
        data: { dob: capsule.identity.dob },
      });
    }
    if (capsule.identity.nationality) {
      nodes.push({
        id: "identity_nationality",
        label: `Nationality: ${capsule.identity.nationality}`,
        domain: "identity",
        data: { nationality: capsule.identity.nationality },
      });
    }
    if (capsule.identity.pan) {
      nodes.push({
        id: "identity_pan",
        label: `PAN: ${capsule.identity.pan}`,
        domain: "identity",
        data: { pan: capsule.identity.pan },
      });
    }
  }

  // ── education ──
  if (capsule.education) {
    const hasAnyEducation =
      capsule.education.ssc ||
      capsule.education.hsc ||
      capsule.education.graduation ||
      capsule.education.postGraduation;

    if (hasAnyEducation) {
      // education root node
      nodes.push({
        id: "edu_1",
        label: "Education",
        domain: "education",
        data: { type: "root" },
      });

      // ── SSC ──
      if (capsule.education.ssc?.school || capsule.education.ssc?.year) {
        nodes.push({
          id: "edu_ssc",
          label: "SSC",
          domain: "education",
          data: { type: "level" },
        });
        if (capsule.education.ssc.school) {
          nodes.push({
            id: "edu_ssc_school",
            label: capsule.education.ssc.school,
            domain: "education",
            data: { school: capsule.education.ssc.school },
          });
        }
        if (capsule.education.ssc.percentage) {
          nodes.push({
            id: "edu_ssc_percentage",
            label: `${capsule.education.ssc.percentage}%`,
            domain: "education",
            data: { percentage: capsule.education.ssc.percentage },
          });
        }
        if (capsule.education.ssc.year) {
          nodes.push({
            id: "edu_ssc_year",
            label: `Year: ${capsule.education.ssc.year}`,
            domain: "education",
            data: { year: capsule.education.ssc.year },
          });
        }
      }

      // ── HSC ──
      if (capsule.education.hsc?.school || capsule.education.hsc?.year) {
        nodes.push({
          id: "edu_hsc",
          label: "HSC",
          domain: "education",
          data: { type: "level" },
        });
        if (capsule.education.hsc.school) {
          nodes.push({
            id: "edu_hsc_school",
            label: capsule.education.hsc.school,
            domain: "education",
            data: { school: capsule.education.hsc.school },
          });
        }
        if (capsule.education.hsc.stream) {
          nodes.push({
            id: "edu_hsc_stream",
            label: `Stream: ${capsule.education.hsc.stream}`,
            domain: "education",
            data: { stream: capsule.education.hsc.stream },
          });
        }
        if (capsule.education.hsc.percentage) {
          nodes.push({
            id: "edu_hsc_percentage",
            label: `${capsule.education.hsc.percentage}%`,
            domain: "education",
            data: { percentage: capsule.education.hsc.percentage },
          });
        }
        if (capsule.education.hsc.year) {
          nodes.push({
            id: "edu_hsc_year",
            label: `Year: ${capsule.education.hsc.year}`,
            domain: "education",
            data: { year: capsule.education.hsc.year },
          });
        }
      }

      // ── Graduation ──
      if (capsule.education.graduation?.degree || capsule.education.graduation?.college) {
        nodes.push({
          id: "edu_grad",
          label: "Graduation",
          domain: "education",
          data: { type: "level" },
        });
        if (capsule.education.graduation.degree) {
          nodes.push({
            id: "edu_grad_degree",
            label: capsule.education.graduation.degree,
            domain: "education",
            data: { degree: capsule.education.graduation.degree },
          });
        }
        if (capsule.education.graduation.college) {
          nodes.push({
            id: "edu_grad_college",
            label: capsule.education.graduation.college,
            domain: "education",
            data: { college: capsule.education.graduation.college },
          });
        }
        if (capsule.education.graduation.gpa) {
          nodes.push({
            id: "edu_grad_gpa",
            label: `GPA: ${capsule.education.graduation.gpa}`,
            domain: "education",
            data: { gpa: capsule.education.graduation.gpa },
          });
        }
        if (capsule.education.graduation.year_of_passing) {
          nodes.push({
            id: "edu_grad_year",
            label: `Year: ${capsule.education.graduation.year_of_passing}`,
            domain: "education",
            data: { year: capsule.education.graduation.year_of_passing },
          });
        }
      }

      // ── Post Graduation ──
      if (capsule.education.postGraduation?.degree || capsule.education.postGraduation?.college) {
        nodes.push({
          id: "edu_pg",
          label: "Post Graduation",
          domain: "education",
          data: { type: "level" },
        });
        if (capsule.education.postGraduation.degree) {
          nodes.push({
            id: "edu_pg_degree",
            label: capsule.education.postGraduation.degree,
            domain: "education",
            data: { degree: capsule.education.postGraduation.degree },
          });
        }
        if (capsule.education.postGraduation.college) {
          nodes.push({
            id: "edu_pg_college",
            label: capsule.education.postGraduation.college,
            domain: "education",
            data: { college: capsule.education.postGraduation.college },
          });
        }
        if (capsule.education.postGraduation.gpa) {
          nodes.push({
            id: "edu_pg_gpa",
            label: `GPA: ${capsule.education.postGraduation.gpa}`,
            domain: "education",
            data: { gpa: capsule.education.postGraduation.gpa },
          });
        }
        if (capsule.education.postGraduation.year_of_passing) {
          nodes.push({
            id: "edu_pg_year",
            label: `Year: ${capsule.education.postGraduation.year_of_passing}`,
            domain: "education",
            data: { year: capsule.education.postGraduation.year_of_passing },
          });
        }
      }
    }
  }

  // ── finance ──
  if (capsule.finance) {
    const hasAnyFinance =
      capsule.finance.income ||
      capsule.finance.credit_score ||
      capsule.finance.bank ||
      capsule.finance.loans?.length > 0 ||
      capsule.finance.assets?.length > 0;

    if (hasAnyFinance) {
      nodes.push({
        id: "fin_1",
        label: "Finance",
        domain: "finance",
        data: { type: "root" },
      });

      if (capsule.finance.income) {
        nodes.push({
          id: "fin_income",
          label: `Income: ${capsule.finance.income}`,
          domain: "finance",
          data: { income: capsule.finance.income },
        });

        // assets under income
        if (capsule.finance.assets?.length > 0) {
          capsule.finance.assets.forEach((asset, i) => {
            nodes.push({
              id: `fin_asset_${i}`,
              label: `Asset: ${asset}`,
              domain: "finance",
              data: { asset },
            });
          });
        }
      }

      if (capsule.finance.credit_score) {
        nodes.push({
          id: "fin_credit",
          label: `Credit: ${capsule.finance.credit_score}`,
          domain: "finance",
          data: { credit_score: capsule.finance.credit_score },
        });
      }

      if (capsule.finance.bank) {
        nodes.push({
          id: "fin_bank",
          label: `Bank: ${capsule.finance.bank}`,
          domain: "finance",
          data: { bank: capsule.finance.bank },
        });

        // loans under bank
        if (capsule.finance.loans?.length > 0) {
          capsule.finance.loans.forEach((loan, i) => {
            nodes.push({
              id: `fin_loan_${i}`,
              label: `Loan: ${loan}`,
              domain: "finance",
              data: { loan },
            });
          });
        }
      }
    }
  }

  // ── health ──
  if (capsule.health) {
    const hasAnyHealth =
      capsule.health.blood_group ||
      capsule.health.insurance ||
      capsule.health.conditions?.length > 0;

    if (hasAnyHealth) {
      nodes.push({
        id: "health_1",
        label: "Health",
        domain: "health",
        data: { type: "root" },
      });

      if (capsule.health.blood_group) {
        nodes.push({
          id: "health_blood",
          label: `Blood: ${capsule.health.blood_group}`,
          domain: "health",
          data: { blood_group: capsule.health.blood_group },
        });
      }
      if (capsule.health.insurance) {
        nodes.push({
          id: "health_insurance",
          label: `Insurance: ${capsule.health.insurance}`,
          domain: "health",
          data: { insurance: capsule.health.insurance },
        });
      }
      if (capsule.health.conditions?.length > 0) {
        capsule.health.conditions.forEach((condition, i) => {
          nodes.push({
            id: `health_condition_${i}`,
            label: `Condition: ${condition}`,
            domain: "health",
            data: { condition },
          });
        });
      }
    }
  }

  return nodes;
};

const buildEdges = (nodes) => {
  const edges = [];
  const nodeIds = new Set(nodes.map((n) => n.id));

  // ── identity root → identity fields directly ──
  if (nodeIds.has("identity_1")) {
    if (nodeIds.has("identity_dob")) {
      edges.push({ from: "identity_1", to: "identity_dob", relation: "born" });
    }
    if (nodeIds.has("identity_nationality")) {
      edges.push({ from: "identity_1", to: "identity_nationality", relation: "citizen_of" });
    }
    if (nodeIds.has("identity_pan")) {
      edges.push({ from: "identity_1", to: "identity_pan", relation: "identified_by" });
    }

    // identity → domain roots
    if (nodeIds.has("edu_1")) {
      edges.push({ from: "identity_1", to: "edu_1", relation: "studied" });
    }
    if (nodeIds.has("fin_1")) {
      edges.push({ from: "identity_1", to: "fin_1", relation: "has_finance" });
    }
    if (nodeIds.has("health_1")) {
      edges.push({ from: "identity_1", to: "health_1", relation: "has_health" });
    }
  }

  // ── education ──
  // edu root → level nodes
  if (nodeIds.has("edu_1")) {
    if (nodeIds.has("edu_ssc")) {
      edges.push({ from: "edu_1", to: "edu_ssc", relation: "completed" });
    }
    if (nodeIds.has("edu_hsc")) {
      edges.push({ from: "edu_1", to: "edu_hsc", relation: "completed" });
    }
    if (nodeIds.has("edu_grad")) {
      edges.push({ from: "edu_1", to: "edu_grad", relation: "completed" });
    }
    if (nodeIds.has("edu_pg")) {
      edges.push({ from: "edu_1", to: "edu_pg", relation: "completed" });
    }
  }

  // ssc → its fields
  if (nodeIds.has("edu_ssc")) {
    if (nodeIds.has("edu_ssc_school")) {
      edges.push({ from: "edu_ssc", to: "edu_ssc_school", relation: "at" });
    }
    if (nodeIds.has("edu_ssc_percentage")) {
      edges.push({ from: "edu_ssc", to: "edu_ssc_percentage", relation: "scored" });
    }
    if (nodeIds.has("edu_ssc_year")) {
      edges.push({ from: "edu_ssc", to: "edu_ssc_year", relation: "passed_in" });
    }
  }

  // hsc → its fields
  if (nodeIds.has("edu_hsc")) {
    if (nodeIds.has("edu_hsc_school")) {
      edges.push({ from: "edu_hsc", to: "edu_hsc_school", relation: "at" });
    }
    if (nodeIds.has("edu_hsc_stream")) {
      edges.push({ from: "edu_hsc", to: "edu_hsc_stream", relation: "stream" });
    }
    if (nodeIds.has("edu_hsc_percentage")) {
      edges.push({ from: "edu_hsc", to: "edu_hsc_percentage", relation: "scored" });
    }
    if (nodeIds.has("edu_hsc_year")) {
      edges.push({ from: "edu_hsc", to: "edu_hsc_year", relation: "passed_in" });
    }
  }

  // graduation → its fields
  if (nodeIds.has("edu_grad")) {
    if (nodeIds.has("edu_grad_degree")) {
      edges.push({ from: "edu_grad", to: "edu_grad_degree", relation: "degree" });
    }
    if (nodeIds.has("edu_grad_college")) {
      edges.push({ from: "edu_grad", to: "edu_grad_college", relation: "at" });
    }
    if (nodeIds.has("edu_grad_gpa")) {
      edges.push({ from: "edu_grad", to: "edu_grad_gpa", relation: "scored" });
    }
    if (nodeIds.has("edu_grad_year")) {
      edges.push({ from: "edu_grad", to: "edu_grad_year", relation: "passed_in" });
    }
  }

  // post graduation → its fields
  if (nodeIds.has("edu_pg")) {
    if (nodeIds.has("edu_pg_degree")) {
      edges.push({ from: "edu_pg", to: "edu_pg_degree", relation: "degree" });
    }
    if (nodeIds.has("edu_pg_college")) {
      edges.push({ from: "edu_pg", to: "edu_pg_college", relation: "at" });
    }
    if (nodeIds.has("edu_pg_gpa")) {
      edges.push({ from: "edu_pg", to: "edu_pg_gpa", relation: "scored" });
    }
    if (nodeIds.has("edu_pg_year")) {
      edges.push({ from: "edu_pg", to: "edu_pg_year", relation: "passed_in" });
    }
  }

  // ── finance ──
  if (nodeIds.has("fin_1")) {
    if (nodeIds.has("fin_income")) {
      edges.push({ from: "fin_1", to: "fin_income", relation: "income" });
    }
    if (nodeIds.has("fin_credit")) {
      edges.push({ from: "fin_1", to: "fin_credit", relation: "credit_score" });
    }
    if (nodeIds.has("fin_bank")) {
      edges.push({ from: "fin_1", to: "fin_bank", relation: "bank" });
    }
  }

  // income → assets
  if (nodeIds.has("fin_income")) {
    nodes
      .filter((n) => n.id.startsWith("fin_asset_"))
      .forEach((n) => {
        edges.push({ from: "fin_income", to: n.id, relation: "owns" });
      });
  }

  // bank → loans
  if (nodeIds.has("fin_bank")) {
    nodes
      .filter((n) => n.id.startsWith("fin_loan_"))
      .forEach((n) => {
        edges.push({ from: "fin_bank", to: n.id, relation: "has_loan" });
      });
  }

  // ── health ──
  if (nodeIds.has("health_1")) {
    if (nodeIds.has("health_blood")) {
      edges.push({ from: "health_1", to: "health_blood", relation: "blood_type" });
    }
    if (nodeIds.has("health_insurance")) {
      edges.push({ from: "health_1", to: "health_insurance", relation: "insured_by" });
    }
    nodes
      .filter((n) => n.id.startsWith("health_condition_"))
      .forEach((n) => {
        edges.push({ from: "health_1", to: n.id, relation: "has_condition" });
      });
  }

  return edges;
};

// ─────────────────────────────────────────
// MAIN FUNCTION
// ─────────────────────────────────────────
export const generateGraph = async (userId, capsule) => {
  try {
    if (!userId) {
      console.error("generateGraph called without userId");
      return;
    }

    const nodes = buildNodes(capsule);
    const edges = buildEdges(nodes);

    const graph = await Graph.findOneAndUpdate(
      { userId },
      { userId, nodes, edges },
      { new: true, upsert: true }
    );

    return graph;

  } catch (error) {
    console.error("Graph generation error:", error.message);
  }
};