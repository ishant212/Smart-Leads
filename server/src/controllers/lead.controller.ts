import { Response } from "express";
import Lead from "../models/Lead.model";
import { AuthRequest } from "../middleware/auth.middleware";

// CREATE LEAD
export const createLead = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { name, email, status, source } =
      req.body;

    const lead = await Lead.create({
      name,
      email,
      status,
      source,
      createdBy: req.user?.id,
    });

    res.status(201).json({
      message: "Lead created successfully",
      lead,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};

// GET ALL LEADS
export const getLeads = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    // QUERY PARAMS
    const {
      status,
      source,
      search,
      sort,
      page = "1",
    } = req.query;

    // FILTER OBJECT
    const filter: any = {};

    // FILTER BY STATUS
    if (status) {
      filter.status = status;
    }

    // FILTER BY SOURCE
    if (source) {
      filter.source = source;
    }

    // SEARCH BY NAME OR EMAIL
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // SORTING
    let sortOption = {};

    if (sort === "latest") {
      sortOption = { createdAt: -1 };
    }

    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    // PAGINATION
    const pageNumber = Number(page) || 1;

    const limit = 10;

    const skip = (pageNumber - 1) * limit;

    // TOTAL COUNT
    const totalLeads =
      await Lead.countDocuments(filter);

    // GET LEADS
    const leads = await Lead.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email");

    res.status(200).json({
      currentPage: pageNumber,
      totalPages: Math.max(
  Math.ceil(totalLeads / limit),
  1
),
      totalLeads,
      count: leads.length,
      leads,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error instanceof Error
        ? error.message
        : error,
    });
  }
};
// GET SINGLE LEAD
export const getSingleLead = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const lead = await Lead.findById(
      req.params.id
    ).populate("createdBy", "name email");

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.status(200).json({
      lead,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error instanceof Error
        ? error.message
        : error,
    });
  }
};

// UPDATE LEAD
export const updateLead = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.status(200).json({
      message: "Lead updated successfully",
      lead,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error instanceof Error
        ? error.message
        : error,
    });
  }
};

// DELETE LEAD
export const deleteLead = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const lead = await Lead.findByIdAndDelete(
      req.params.id
    );

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.status(200).json({
      message: "Lead deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error instanceof Error
        ? error.message
        : error,
    });
  }
};