# VedaAI — Database Schemas (MongoDB + Mongoose)

VedaAI stores and structures its data on MongoDB Atlas, utilizing the Mongoose ODM. Schemas enforce type validation, pre-save triggers, and support standard references for relational lookups.

---

## 👥 1. User Model (`users` Collection)

Represents authenticated teachers who manage and schedule assessments.

- **Schema Definition**:
```javascript
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
  },
  {
    timestamps: true, // Auto-generates createdAt and updatedAt
  }
);
```

### 🔐 Triggers & Helper Methods
1. **Password Hashing (Pre-Save)**: Before a user document is written to MongoDB, the password field is hashed using `bcryptjs` with `10` rounds of salt calculation (if modified).
2. **Password Verification Method**: `matchPassword(enteredPassword)` compares typed passwords securely with the database hash.

---

## 📝 2. Test Model (`tests` Collection)

Represents generated assessments, containing parameters, metadata, and an array of embedded question subdocuments.

- **Question Sub-Schema**:
```javascript
const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
  },
  options: {
    type: [String],
    default: [], // Filled only for type 'mcq'
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['mcq', 'short', 'long'],
    default: 'mcq',
  },
  sort_order: {
    type: Number,
    default: 0,
  },
});
```

- **Test Main Schema**:
```javascript
const TestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    instructions: {
      type: String,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    duration_minutes: {
      type: Number,
      default: 30,
    },
    total_questions: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'active', 'ended'],
      default: 'draft',
    },
    start_time: {
      type: Date,
      default: null,
    },
    end_time: {
      type: Date,
      default: null,
    },
    source_document: {
      type: mongoose.Schema.Types.Mixed, // Stores file metadata if AI-generated
      default: null,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Relational reference to the User model
      required: true,
    },
    questions: {
      type: [QuestionSchema],
      default: [], // Embedded array of QuestionSchema documents
    },
  },
  {
    timestamps: true,
  }
);
```

### ⚡ Virtual Compatibility Getters
To facilitate 100% backward-compatibility with client-side relational drivers:
- Both `QuestionSchema` and `TestSchema` define a virtual getter mapping `_id` to `id` string representations.
- Virtual properties are dynamically injected when serialized to JSON or standard JS objects.

---

## 📈 3. API Usage Model (`apiusages` Collection)

Tracks AI generation calls, token consumption metrics, and performance latencies.

- **Schema Definition**:
```javascript
const ApiUsageSchema = new mongoose.Schema(
  {
    model: { type: String, required: true },
    prompt_tokens: { type: Number, default: 0 },
    completion_tokens: { type: Number, default: 0 },
    total_tokens: { type: Number, default: 0 },
    latency_ms: { type: Number, default: 0 },
  },
  {
    timestamps: true, // Auto-tracks date of consumption
  }
);
```
